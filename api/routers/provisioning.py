"""
Provisioning API Router
Handles instance provisioning for Wundr Space
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from loguru import logger
import uuid
from datetime import datetime

router = APIRouter()


# Request Models
class OrganizationDetails(BaseModel):
    organization_name: str = Field(..., min_length=2, max_length=100)
    domain: str = Field(..., min_length=3)
    description: str = Field(..., min_length=10, max_length=500)


class AdminAccount(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)


class InstanceConfiguration(BaseModel):
    subdomain: str = Field(..., min_length=3, max_length=63, pattern=r"^[a-z0-9]([a-z0-9-]*[a-z0-9])?$")
    region: str
    ai_provider: str = Field(..., pattern=r"^(ollama|openai|anthropic)$")
    enable_public_access: bool = False
    storage_size: str


class ProvisioningRequest(BaseModel):
    organization_details: OrganizationDetails
    admin_account: AdminAccount
    instance_configuration: InstanceConfiguration
    request_id: Optional[str] = None


# Response Models
class ProvisioningResponse(BaseModel):
    request_id: str
    status: str
    message: str
    instance_url: Optional[str] = None
    estimated_completion_time: Optional[int] = None  # seconds


class ProvisioningStatus(BaseModel):
    request_id: str
    status: str  # "pending", "provisioning", "configuring", "finalizing", "complete", "failed"
    progress: int  # 0-100
    message: str
    instance_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    error: Optional[str] = None


# In-memory storage for demo (replace with database in production)
provisioning_requests = {}


async def provision_instance(request_id: str, request: ProvisioningRequest):
    """
    Background task to provision a new instance
    This is a mock implementation - replace with actual provisioning logic
    """
    try:
        logger.info(f"Starting provisioning for request {request_id}")

        # Update status to provisioning
        provisioning_requests[request_id]["status"] = "provisioning"
        provisioning_requests[request_id]["progress"] = 25
        provisioning_requests[request_id]["message"] = "Provisioning infrastructure on Google Cloud"

        # Simulate provisioning steps (replace with actual implementation)
        # TODO: Implement actual Google Cloud Run provisioning

        # Step 1: Provision infrastructure
        logger.info(f"Provisioning infrastructure for {request.instance_configuration.subdomain}")

        # Step 2: Configure Firebase Auth
        provisioning_requests[request_id]["status"] = "configuring"
        provisioning_requests[request_id]["progress"] = 50
        provisioning_requests[request_id]["message"] = "Configuring Firebase Authentication"
        logger.info(f"Configuring Firebase Auth for {request_id}")

        # Step 3: Set up instance
        provisioning_requests[request_id]["status"] = "finalizing"
        provisioning_requests[request_id]["progress"] = 75
        provisioning_requests[request_id]["message"] = "Setting up your Knowledge Space"
        logger.info(f"Finalizing instance setup for {request_id}")

        # Complete
        instance_url = f"https://{request.instance_configuration.subdomain}.hub.wundr.space"
        provisioning_requests[request_id]["status"] = "complete"
        provisioning_requests[request_id]["progress"] = 100
        provisioning_requests[request_id]["message"] = "Instance provisioned successfully"
        provisioning_requests[request_id]["instance_url"] = instance_url
        provisioning_requests[request_id]["updated_at"] = datetime.utcnow()

        logger.success(f"Provisioning completed for {request_id}: {instance_url}")

    except Exception as e:
        logger.error(f"Provisioning failed for {request_id}: {str(e)}")
        provisioning_requests[request_id]["status"] = "failed"
        provisioning_requests[request_id]["error"] = str(e)
        provisioning_requests[request_id]["updated_at"] = datetime.utcnow()


@router.post("/provisioning/instances", response_model=ProvisioningResponse)
async def create_instance(
    request: ProvisioningRequest,
    background_tasks: BackgroundTasks
):
    """
    Create a new Open Notebook instance
    """
    try:
        # Generate request ID
        request_id = request.request_id or str(uuid.uuid4())

        # Validate subdomain uniqueness (mock check)
        subdomain = request.instance_configuration.subdomain
        for req in provisioning_requests.values():
            if req.get("subdomain") == subdomain and req.get("status") != "failed":
                raise HTTPException(
                    status_code=400,
                    detail=f"Subdomain '{subdomain}' is already taken"
                )

        # Store provisioning request
        provisioning_requests[request_id] = {
            "request_id": request_id,
            "status": "pending",
            "progress": 0,
            "message": "Provisioning request received",
            "instance_url": None,
            "subdomain": subdomain,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "request_data": request.model_dump()
        }

        # Start provisioning in background
        background_tasks.add_task(provision_instance, request_id, request)

        logger.info(f"Provisioning request created: {request_id} for subdomain: {subdomain}")

        return ProvisioningResponse(
            request_id=request_id,
            status="pending",
            message="Provisioning started. Check status endpoint for updates.",
            estimated_completion_time=180  # 3 minutes estimate
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to create provisioning request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/provisioning/instances/{request_id}/status", response_model=ProvisioningStatus)
async def get_provisioning_status(request_id: str):
    """
    Get the status of a provisioning request
    """
    if request_id not in provisioning_requests:
        raise HTTPException(status_code=404, detail="Provisioning request not found")

    req = provisioning_requests[request_id]

    return ProvisioningStatus(
        request_id=req["request_id"],
        status=req["status"],
        progress=req["progress"],
        message=req["message"],
        instance_url=req.get("instance_url"),
        created_at=req["created_at"],
        updated_at=req["updated_at"],
        error=req.get("error")
    )


@router.get("/provisioning/subdomains/{subdomain}/available")
async def check_subdomain_availability(subdomain: str):
    """
    Check if a subdomain is available
    """
    # Check against existing requests
    for req in provisioning_requests.values():
        if req.get("subdomain") == subdomain and req.get("status") != "failed":
            return {"available": False, "subdomain": subdomain}

    return {"available": True, "subdomain": subdomain}

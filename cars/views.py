from __future__ import annotations

from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Brand, Car, Inquiry
from .serializers import (
    BrandSerializer,
    CarDetailSerializer,
    CarListSerializer,
    InquiryCreateSerializer,
)


class BrandListView(generics.ListAPIView):
    """
    GET /api/cars/brands/
    List all car brands.
    """

    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]
    pagination_class = None  # Return all brands without pagination


class BrandDetailView(generics.RetrieveAPIView):
    """
    GET /api/cars/brands/{id}/
    Get a specific brand by ID.
    """

    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]


class CarListView(generics.ListAPIView):
    """
    GET /api/cars/
    List all active cars. Supports filtering by brand.
    
    Query parameters:
    - brand: Filter by brand ID
    - featured: Filter by featured status (true/false)
    """

    serializer_class = CarListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Car.objects.filter(status=Car.Status.ACTIVE).select_related("brand").prefetch_related("images")
        
        # Filter by brand
        brand_id = self.request.query_params.get("brand")
        if brand_id:
            queryset = queryset.filter(brand_id=brand_id)
        
        # Filter by featured
        featured = self.request.query_params.get("featured")
        if featured is not None:
            is_featured = featured.lower() in ("true", "1", "yes")
            queryset = queryset.filter(is_featured=is_featured)
        
        return queryset


class CarDetailView(generics.RetrieveAPIView):
    """
    GET /api/cars/{id}/
    Get a specific car by ID.
    """

    queryset = Car.objects.filter(status=Car.Status.ACTIVE).select_related("brand").prefetch_related("images")
    serializer_class = CarDetailSerializer
    permission_classes = [AllowAny]


class InquiryCreateView(generics.CreateAPIView):
    """
    POST /api/cars/inquiries/
    Create a new inquiry (contact form submission).
    """

    queryset = Inquiry.objects.all()
    serializer_class = InquiryCreateSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "Inquiry submitted successfully", "data": serializer.data},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

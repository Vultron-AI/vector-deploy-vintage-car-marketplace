from __future__ import annotations

from django.urls import path

from .views import (
    BrandDetailView,
    BrandListView,
    CarDetailView,
    CarListView,
    InquiryCreateView,
)

app_name = "cars"

urlpatterns = [
    # Brands
    path("brands/", BrandListView.as_view(), name="brand-list"),
    path("brands/<uuid:pk>/", BrandDetailView.as_view(), name="brand-detail"),
    
    # Cars
    path("", CarListView.as_view(), name="car-list"),
    path("<uuid:pk>/", CarDetailView.as_view(), name="car-detail"),
    
    # Inquiries
    path("inquiries/", InquiryCreateView.as_view(), name="inquiry-create"),
]

"""Tests for the cars API endpoints."""
from __future__ import annotations

import pytest
from rest_framework import status
from rest_framework.test import APIClient

from cars.models import Brand, Car, CarImage, Inquiry
from cars.tests.factories import (
    create_brand,
    create_car,
    create_car_image,
    create_inquiry,
)


@pytest.mark.django_db
class TestBrandListAPI:
    """Tests for the brand list endpoint."""

    def test_list_brands_returns_all_brands(self, api_client: APIClient):
        """GET /api/cars/brands/ should return all brands."""
        brand1 = create_brand(name="Ferrari")
        brand2 = create_brand(name="Porsche")
        brand3 = create_brand(name="Mercedes-Benz")

        response = api_client.get("/api/cars/brands/")

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 3
        # Brands should be ordered by name
        names = [b["name"] for b in response.data]
        assert names == ["Ferrari", "Mercedes-Benz", "Porsche"]

    def test_list_brands_empty(self, api_client: APIClient):
        """GET /api/cars/brands/ should return empty list when no brands."""
        response = api_client.get("/api/cars/brands/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data == []

    def test_list_brands_no_authentication_required(self, api_client: APIClient):
        """GET /api/cars/brands/ should be accessible without authentication."""
        create_brand()
        response = api_client.get("/api/cars/brands/")
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestBrandDetailAPI:
    """Tests for the brand detail endpoint."""

    def test_get_brand_detail(self, api_client: APIClient):
        """GET /api/cars/brands/{id}/ should return brand details."""
        brand = create_brand(
            name="Lamborghini",
            description="Italian luxury sports car manufacturer",
        )

        response = api_client.get(f"/api/cars/brands/{brand.id}/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == str(brand.id)
        assert response.data["name"] == "Lamborghini"
        assert response.data["description"] == "Italian luxury sports car manufacturer"

    def test_get_brand_not_found(self, api_client: APIClient):
        """GET /api/cars/brands/{id}/ should return 404 for non-existent brand."""
        import uuid
        fake_id = uuid.uuid4()
        response = api_client.get(f"/api/cars/brands/{fake_id}/")
        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestCarListAPI:
    """Tests for the car list endpoint."""

    def test_list_cars_returns_only_active_cars(self, api_client: APIClient):
        """GET /api/cars/ should return only active cars."""
        brand = create_brand()
        active_car = create_car(brand=brand, model="Active Car", status=Car.Status.ACTIVE)
        create_car(brand=brand, model="Draft Car", status=Car.Status.DRAFT)
        create_car(brand=brand, model="Sold Car", status=Car.Status.SOLD)

        response = api_client.get("/api/cars/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert response.data["results"][0]["id"] == str(active_car.id)

    def test_list_cars_filter_by_brand(self, api_client: APIClient):
        """GET /api/cars/?brand={id} should filter cars by brand."""
        ferrari = create_brand(name="Ferrari")
        porsche = create_brand(name="Porsche")
        ferrari_car = create_car(brand=ferrari, model="250 GTO")
        create_car(brand=porsche, model="911")

        response = api_client.get(f"/api/cars/?brand={ferrari.id}")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert response.data["results"][0]["id"] == str(ferrari_car.id)

    def test_list_cars_filter_by_featured(self, api_client: APIClient):
        """GET /api/cars/?featured=true should filter featured cars."""
        brand = create_brand()
        featured_car = create_car(brand=brand, model="Featured Car", is_featured=True)
        create_car(brand=brand, model="Regular Car", is_featured=False)

        response = api_client.get("/api/cars/?featured=true")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1
        assert response.data["results"][0]["id"] == str(featured_car.id)

    def test_list_cars_includes_primary_image(self, api_client: APIClient):
        """GET /api/cars/ should include primary image URL."""
        brand = create_brand()
        car = create_car(brand=brand)
        create_car_image(car=car, is_primary=False, image_url="https://example.com/secondary.jpg")
        create_car_image(car=car, is_primary=True, image_url="https://example.com/primary.jpg")

        response = api_client.get("/api/cars/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["results"][0]["primary_image"] == "https://example.com/primary.jpg"

    def test_list_cars_no_authentication_required(self, api_client: APIClient):
        """GET /api/cars/ should be accessible without authentication."""
        response = api_client.get("/api/cars/")
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestCarDetailAPI:
    """Tests for the car detail endpoint."""

    def test_get_car_detail(self, api_client: APIClient):
        """GET /api/cars/{id}/ should return car details."""
        brand = create_brand(name="Ferrari")
        car = create_car(
            brand=brand,
            model="250 GTO",
            year=1962,
            price="25000000.00",
            description="A legendary car",
        )
        create_car_image(car=car, is_primary=True)
        create_car_image(car=car, is_primary=False)

        response = api_client.get(f"/api/cars/{car.id}/")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == str(car.id)
        assert response.data["model"] == "250 GTO"
        assert response.data["year"] == 1962
        assert response.data["brand"]["name"] == "Ferrari"
        assert len(response.data["images"]) == 2

    def test_get_car_not_found(self, api_client: APIClient):
        """GET /api/cars/{id}/ should return 404 for non-existent car."""
        import uuid
        fake_id = uuid.uuid4()
        response = api_client.get(f"/api/cars/{fake_id}/")
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_get_car_draft_not_visible(self, api_client: APIClient):
        """GET /api/cars/{id}/ should return 404 for draft cars."""
        brand = create_brand()
        car = create_car(brand=brand, status=Car.Status.DRAFT)

        response = api_client.get(f"/api/cars/{car.id}/")

        assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestInquiryCreateAPI:
    """Tests for the inquiry creation endpoint."""

    def test_create_inquiry_valid_data(self, api_client: APIClient):
        """POST /api/cars/inquiries/ should create an inquiry with valid data."""
        brand = create_brand()
        car = create_car(brand=brand)

        data = {
            "car": str(car.id),
            "collector_name": "John Doe",
            "collector_email": "john@example.com",
            "collector_phone": "+1-555-123-4567",
            "message": "I am very interested in purchasing this beautiful vintage car.",
        }

        response = api_client.post("/api/cars/inquiries/", data)

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["message"] == "Inquiry submitted successfully"
        assert Inquiry.objects.count() == 1
        inquiry = Inquiry.objects.first()
        assert inquiry.collector_name == "John Doe"
        assert inquiry.collector_email == "john@example.com"
        assert inquiry.car == car

    def test_create_inquiry_without_phone(self, api_client: APIClient):
        """POST /api/cars/inquiries/ should create inquiry without phone (optional)."""
        brand = create_brand()
        car = create_car(brand=brand)

        data = {
            "car": str(car.id),
            "collector_name": "Jane Doe",
            "collector_email": "jane@example.com",
            "message": "I would like to know more about this car please.",
        }

        response = api_client.post("/api/cars/inquiries/", data)

        assert response.status_code == status.HTTP_201_CREATED
        assert Inquiry.objects.count() == 1

    def test_create_inquiry_missing_required_fields(self, api_client: APIClient):
        """POST /api/cars/inquiries/ should fail without required fields."""
        response = api_client.post("/api/cars/inquiries/", {})

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "car" in response.data
        assert "collector_name" in response.data
        assert "collector_email" in response.data
        assert "message" in response.data

    def test_create_inquiry_invalid_email(self, api_client: APIClient):
        """POST /api/cars/inquiries/ should fail with invalid email."""
        brand = create_brand()
        car = create_car(brand=brand)

        data = {
            "car": str(car.id),
            "collector_name": "John Doe",
            "collector_email": "not-an-email",
            "message": "I want to buy this car, please contact me soon.",
        }

        response = api_client.post("/api/cars/inquiries/", data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "collector_email" in response.data

    def test_create_inquiry_message_too_short(self, api_client: APIClient):
        """POST /api/cars/inquiries/ should fail with too short message."""
        brand = create_brand()
        car = create_car(brand=brand)

        data = {
            "car": str(car.id),
            "collector_name": "John Doe",
            "collector_email": "john@example.com",
            "message": "Hi",  # Too short
        }

        response = api_client.post("/api/cars/inquiries/", data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "message" in response.data

    def test_create_inquiry_invalid_car(self, api_client: APIClient):
        """POST /api/cars/inquiries/ should fail with invalid car ID."""
        import uuid
        fake_id = uuid.uuid4()

        data = {
            "car": str(fake_id),
            "collector_name": "John Doe",
            "collector_email": "john@example.com",
            "message": "I am interested in this car, please contact me.",
        }

        response = api_client.post("/api/cars/inquiries/", data)

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "car" in response.data

    def test_create_inquiry_no_authentication_required(self, api_client: APIClient):
        """POST /api/cars/inquiries/ should be accessible without authentication."""
        brand = create_brand()
        car = create_car(brand=brand)

        data = {
            "car": str(car.id),
            "collector_name": "Anonymous",
            "collector_email": "anon@example.com",
            "message": "I do not want to log in but want to inquire about this car.",
        }

        response = api_client.post("/api/cars/inquiries/", data)

        assert response.status_code == status.HTTP_201_CREATED

"""
URL configuration for farm_fresh_v_2_0_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import handler404

urlpatterns = [
    path('admin/', admin.site.urls),
    # Farm Fresh Home App URLs
    path('', include('farm_fresh_app.urls')),
    # Allauth URLs
    path('accounts/', include('allauth.urls')),
    # Path to Products app URL's
    path('products/', include('products.urls')),
    # Path to Shopping cart app URL's
    path('cart/', include('cart.urls')),
    # Path to Checkout app URL's
    path('checkout/', include('checkout.urls')),
    # Path to User profile app URL's
    path('profile/',
         include('user_profiles.urls')),
]

# Path to 404 handler
handler404 = 'farm_fresh_v_2_0_project.views.handler404'

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )

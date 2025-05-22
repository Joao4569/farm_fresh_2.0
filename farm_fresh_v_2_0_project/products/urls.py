from django.urls import path
from . import views
# from django.conf import settings
# from django.conf.urls.static import static

urlpatterns = [
    # Path to all products page
    path('', views.all_products, name='products'),

    # Path to product detail page
    path('<int:product_id>/', views.product_detail, name='product_detail'),

    # Path to add product page for superusers
    path('add/', views.add_product, name='add_product'),

    # Path to edit a product page for superusers
    path('edit/<int:product_id>/', views.edit_product, name='edit_product'),

    # Path to delete a product page for superusers
    path('delete/<int:product_id>/', views.delete_product, name='delete_product'),
]

# if settings.DEBUG:
#     urlpatterns += static(
#         settings.MEDIA_URL,
#         document_root=settings.MEDIA_ROOT
#     )

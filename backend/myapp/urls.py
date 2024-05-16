from django.urls import path

from . import views

urlpatterns = [
    path('homepage', views.home, name='home'),
    path('sample', views.sample_page, name='sample_page'), 
    path('hotels', views.get_hotel_data, name='get_hotel_data'), 
    path('search_hotel_data', views.search_hotel_data, name='search_hotel_data'), 
    path('get_review_data', views.get_review_data, name='get_review_data'),
    path('add_review', views.add_review, name='add_review'),
    path('update_review', views.update_review, name='update_review'),
    path('delete_review', views.delete_review, name='delete_review'),
]
from django.http import HttpResponse    # Create a home view (Allen)
from django.shortcuts import render
import os
from dotenv import load_dotenv
import pymysql
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from datetime import datetime

dotenv_path = os.path.join(os.path.dirname(__file__), 'db.env')
load_dotenv(dotenv_path)

DB_HOST = os.getenv('DB_HOST')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')

living_wage_threshold = {}
crime_rate_threshold = {}
precipitation_threshold = {}

def initialize():
    global living_wage_threshold, crime_rate_threshold, precipitation_threshold
    connection = pymysql.connect(host=DB_HOST,
                                    user=DB_USER,
                                    password=DB_PASSWORD,
                                    db=DB_NAME,
                                    charset='utf8mb4',
                                    cursorclass=pymysql.cursors.DictCursor)
    with connection.cursor() as cursor:
        for i in range(3):
            args = [3, i, 0]
            cursor.callproc('DividePrecipitation', args)
            connection.commit()
            cursor.execute('SELECT @_DividePrecipitation_2')
            output_values = cursor.fetchone()
            precipitation_threshold[i] = output_values["@_DividePrecipitation_2"]

            cursor.callproc('DivideLivingWage', args)
            connection.commit()
            cursor.execute('SELECT @_DivideLivingWage_2')
            output_values = cursor.fetchone()
            living_wage_threshold[i] = output_values["@_DivideLivingWage_2"]

            cursor.callproc('DivideCrimeRate', args)
            connection.commit()
            cursor.execute('SELECT @_DivideCrimeRate_2')
            output_values = cursor.fetchone()
            crime_rate_threshold[i] = output_values["@_DivideCrimeRate_2"]
    
    print("initialize")
    print("living_wage_threshold:", living_wage_threshold)
    print("crime_rate_threshold:", crime_rate_threshold)
    print("precipitation_threshold:", precipitation_threshold)

initialize()

# Create your views here.
# Create a home view (Allen)
def home(request):
    return HttpResponse("Hello, Django!")
# Create a home view (Allen)

# Sample html page (Allen)
def sample_page(request):
    return render(request, 'sample.html')
# Sample html page (Allen)

# Get hotel data (Allen)
def get_hotel_data(request):
    connection = pymysql.connect(host=DB_HOST,
                                 user=DB_USER,
                                 password=DB_PASSWORD,
                                 db=DB_NAME,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    try:
        with connection.cursor() as cursor:
            sql = "SELECT * FROM Hotel;"
            cursor.execute(sql)
            result = cursor.fetchall()
            # print(result)
            return JsonResponse({'data': result}, safe=False)
            # return render(request, 'hotel_data.html', {'hotels': result})
    finally:
        connection.close()
# Get hotel data (Allen)

@csrf_exempt  # Disable CSRF token for demonstration purposes only
@require_http_methods(["POST"])
def search_hotel_data(request):
    global living_wage_threshold, crime_rate_threshold, precipitation_threshold
    # Get the search term from the POST data
    print('search_hotel_data')
    try:
        search_data = json.loads(request.body.decode('utf-8'))
        search_query = search_data.get('search', '')
        living_Wage = search_data.get('livingWage', '')
        crime_rate = search_data.get('crimeRate', '')
        precipitation = search_data.get('precipitation', '')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    connection = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        db=DB_NAME,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    # print("living_rate:", living_Wage)
    # print("crime_rate:", crime_rate)
    # print("precipitation:", precipitation)
    
    try:
        with connection.cursor() as cursor:
            # sql = """
            # SELECT * FROM Hotel
            # WHERE Name LIKE %s OR CityName LIKE %s;
            # """
            # cursor.execute(sql, ('%' + search_query + '%', '%' + search_query + '%'))

            monthMin = 1
            monthMax = 12
            tempMin = -100
            tempMax = 100
            precipMax = precipitation_threshold[precipitation]
            crimeMax = crime_rate_threshold[crime_rate]
            wageMax = living_wage_threshold[living_Wage]
            args = [monthMin, monthMax, tempMin, tempMax, precipMax, crimeMax, wageMax, "%" + search_query + "%"]
            # print(args)
            cursor.callproc('Search', args)
            connection.commit()
            result = cursor.fetchall()
            # print(result)
            return JsonResponse({'data': result}, safe=False)
    finally:
        connection.close()

@csrf_exempt  # Disable CSRF token for demonstration purposes only
@require_http_methods(["POST"])
def get_review_data(request):
    connection = pymysql.connect(host=DB_HOST,
                                 user=DB_USER,
                                 password=DB_PASSWORD,
                                 db=DB_NAME,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    try:
        query_data = json.loads(request.body.decode('utf-8'))
        hotel_name = query_data.get('hotelName', '')
        city_name = query_data.get('cityName', '')
        with connection.cursor() as cursor:
            if not hotel_name or not city_name:
                sql = "SELECT * FROM Review;"
                print('hotel_name or city_name is empty')
                cursor.execute(sql)
            else:
                sql = "SELECT * FROM Review WHERE HotelName = %s AND CityName = %s;"
                cursor.execute(sql, (hotel_name, city_name))
            result = cursor.fetchall()
            # print(result)
            return JsonResponse({'data': result}, safe=False)
    finally:
        connection.close()

@csrf_exempt
@require_http_methods(["POST"])
def add_review(request):
    print(request)
    connection = pymysql.connect(host=DB_HOST,
                                 user=DB_USER,
                                 password=DB_PASSWORD,
                                 db=DB_NAME,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    try:
        query_data = json.loads(request.body.decode('utf-8'))
        user_name = query_data.get('userName', '')
        title = query_data.get('title', '')
        text = query_data.get('text', '')
        rating = float(query_data.get('rating', '0.0'))
        hotel_name = query_data.get('hotelName', '')
        city_name = query_data.get('cityName', '')
        time = datetime.now()
        # print("user_name:", user_name)
        # print("title:", title)
        # print("text:", text)
        # print("rating:", rating)
        # print("hotel_name:", hotel_name)
        # print("city_name:", city_name)
        # print("time:", time)

        with connection.cursor() as cursor:
            sql = "INSERT INTO Review (UserName, Title, Text, Rating, Date, HotelName, CityName) VALUES (%s, %s, %s, %s, %s, %s, %s);"
            cursor.execute(sql, (user_name, title, text, rating, time, hotel_name, city_name))
            connection.commit()
            return JsonResponse({'status': 'success'}, status=201)
            
    finally:
        connection.close()

@csrf_exempt
@require_http_methods(["POST"])
def update_review(request):
    connection = pymysql.connect(host=DB_HOST,
                                 user=DB_USER,
                                 password=DB_PASSWORD,
                                 db=DB_NAME,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    try:
        query_data = json.loads(request.body.decode('utf-8'))
        user_name = query_data.get('userName', '')
        title = query_data.get('title', '')
        text = query_data.get('text', '')
        rating = query_data.get('rating', '')
        hotel_name = query_data.get('hotelName', '')
        city_name = query_data.get('cityName', '')
        Datetime = datetime.now()
        # print(query_data)
        with connection.cursor() as cursor:
            sql = "UPDATE Review SET Title = %s, Text = %s, Rating = %s, Date = %s WHERE UserName = %s AND HotelName = %s AND CityName = %s;"
            cursor.execute(sql, (title, text, rating, Datetime, user_name, hotel_name, city_name))
            connection.commit()
            return JsonResponse({'status': 'success'}, status=201)
    finally:
        connection.close()

@csrf_exempt
@require_http_methods(["POST"])
def delete_review(request):
    connection = pymysql.connect(host=DB_HOST,
                                 user=DB_USER,
                                 password=DB_PASSWORD,
                                 db=DB_NAME,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    try:
        query_data = json.loads(request.body.decode('utf-8'))
        user_name = query_data.get('userName', '')
        hotel_name = query_data.get('hotelName', '')
        city_name = query_data.get('cityName', '')
        print(user_name)
        print(hotel_name)
        print(city_name)
        with connection.cursor() as cursor:
            sql = "DELETE FROM Review WHERE UserName = %s AND HotelName = %s AND CityName = %s;"
            cursor.execute(sql, (user_name, hotel_name, city_name))
            connection.commit()
            return JsonResponse({'status': 'success'}, status=201)
    finally:
        connection.close()
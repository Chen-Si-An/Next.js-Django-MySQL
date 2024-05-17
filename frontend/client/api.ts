import axios from 'axios';

// Create an axios instance configured with a base URL and default headers.
const apiClient = axios.create({
  baseURL: `http://${process.env.NEXT_PUBLIC_API_URL}/`,
  headers: {
    'Content-Type': 'application/json'
  }
});


export const getHotelData = async () => {
    try {
      const response = await apiClient.get('hotels');
      return response.data.data;
    } catch (error) {
      console.error("Could not fetch hotel data", error);
    }
};

export const searchHotelData = async (searchQuery: any, selectedLivingWageOption: any, selectedCrimeRateOption: any, selectedPrecipitationOption: any) => {
    // console.log(searchQuery);
    // console.log(selectedLivingWageOption);
    // console.log(selectedCrimeRateOption);
    // console.log(selectedPrecipitationOption);
    try {
      const response = await apiClient.post('search_hotel_data', { search: searchQuery, livingWage: selectedLivingWageOption.value, crimeRate: selectedCrimeRateOption.value, precipitation: selectedPrecipitationOption.value});
      return response.data.data;
    } catch (error) {
      console.error("Could not fetch hotel data", error);
    }
};

export const getReviewData = async (hotelName: any, cityName: any) => {
    try {
      const response = await apiClient.post('get_review_data', { hotelName, cityName });
      return response.data.data;
    } catch (error) {
      console.error("Could not fetch review data", error);
    }
};

const deleteReview = async (userName: string, hotelName: string, cityName: string) => {
    try {
      const response = await fetch(`http://${process.env.NEXT_PUBLIC_API_URL}/delete_review`, {
        method: 'POST',
        body: JSON.stringify({ userName, hotelName, cityName }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      window.location.reload();
      // Refresh the page or update the state to reflect the deleted review
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting the review. Please try again.');
    }
};
  
export { deleteReview };
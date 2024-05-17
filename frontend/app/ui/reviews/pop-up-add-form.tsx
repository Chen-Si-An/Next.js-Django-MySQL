import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { StarIcon } from '@heroicons/react/20/solid'
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';




interface AddReviewPopup {
  cityName: string;
  hotelName: string;
}

const AddReviewPopup: React.FC<AddReviewPopup> = ({ cityName , hotelName }) => {
  // console.log("OpenAdd Popup ");
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [title, setTitle] = useState('');
  // const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  // const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [rating, setRating] = React.useState<number | null>(2);


  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const reviewToSend = { userName, title, rating, text, hotelName, cityName };
      console.log(reviewToSend)
      const response = await axios.post(`http://${process.env.NEXT_PUBLIC_API_URL}/add_review`, reviewToSend);
      setOpen(false); // Close the dialog after submission
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('An error occurred while adding the review. Please try again.');
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Add Review
      </Button>
      {/* Review Form */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add a Review</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
        <form>


      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Write your Experience</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Username
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">Name/</span>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="kevin"
                    onChange={(event) => setUserName(event.target.value)}
                  />
                </div>
              </div>
            </div>

            


            <div className="col-span-full">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                Review
              </label>

              <label htmlFor="about" className="mt-3 text-sm leading-6 text-gray-600">
                Title
              </label>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={1}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">Write your experience about your hotel.</p>
              <div className="mt-2">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                />
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-600">Rating (out of 5)</p>
              <Box
                sx={{
                  '& > legend': { mt: 2 },
                }}
                >
                {/* <Typography component="legend">Controlled</Typography> */}
                <Rating
                  name="simple-controlled"
                  value={rating}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />
              </Box>

              
      
            </div>

            <div className="col-span-full">
              <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                Photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Review Form */}
    </div>
  );
};

export default AddReviewPopup;
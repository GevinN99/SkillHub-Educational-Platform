import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress'; // Import the spinner

const labels = {
  0.5: 'Useless',
  1: 'Useless+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

export default function HoverRating() {
  const [ratings, setRatings] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [hover, setHover] = useState(-1);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState('');
  const learnerId = localStorage.getItem("learnerId");

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await axios.get(`http://localhost:8074/api/ratings`);
        setRatings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch ratings');
        setLoading(false);
        console.error('Error fetching ratings:', err);
      }
    };

    fetchRatings();
  }, []);

  const handleRatingSubmit = async () => {
    if (selectedRating === null) {
      alert('Please select a rating before submitting.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8074/api/ratings', {
        user: learnerId,
        value: selectedRating,
        comment: labels[selectedRating]
      });
      setRatings([...ratings, response.data]);
      alert('Rating submitted successfully!');
      setLoading(false);
    } catch (err) {
      setError(`Failed to submit rating: ${err.response ? err.response.data.message : err.message}`);
      setLoading(false);
      console.error('Error submitting rating:', err);
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ width: 400, mx: 'auto', my: 4 }}>
      <Rating
        name="hover-feedback"
        size="large"
        value={selectedRating}
        precision={0.5}
        getLabelText={getLabelText}
        onChange={(event, newValue) => {
          setSelectedRating(newValue);
        }}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
        emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
      />
      {selectedRating !== null && (
        <Box sx={{ mt: 2 }}>{labels[hover !== -1 ? hover : selectedRating]}</Box>
      )}
      <Button
        onClick={handleRatingSubmit}
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ mt: 2 }}
      >
        Submit Rating
      </Button>
      {/* {error && <Box sx={{ color: 'red', mt: 2 }}>{error}</Box>}
      {ratings.map((rating) => (
        <Box key={rating._id} sx={{ mt: 2 }}>
          <Rating value={rating.value} readOnly />
          <p>{`Comment: ${rating.comment}`}</p>
        </Box>
      ))} */}
    </Box>
  );
}

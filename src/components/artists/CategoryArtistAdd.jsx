import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const CategoryArtistAdd = () => {
  const navigate = useNavigate();
  const [sessionName, setSessionName] = useState('');
  const [sessionRank, setSessionRank] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoryRankModel, setCategoryRankModel] = useState([
    { category_id: '', artist_id: '', artist_rank: '', artists: [] },
  ]);

  // Fetch categories on component mount
  useEffect(() => {
    axios
      .get('http://35.154.161.226:5000/api/category')
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error('Failed to fetch categories', err));
  }, []);

  const handleAddField = () => {
    setCategoryRankModel([
      ...categoryRankModel,
      { category_id: '', artist_id: '', artist_rank: '' },
    ]);
  };
  

  // Fetch artists by category ID and update state
  const fetchArtistsByCategory = async (category_id, index) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/artists_details?category_id=${category_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updated = [...categoryRankModel];
      updated[index].artists = response.data || [];
      setCategoryRankModel(updated);
    } catch (error) {
      console.error('Failed to fetch artists by category', error);
    }
  };

  // Handle input changes for category rank model
  const handleChange = async (index, field, value) => {
    const updated = [...categoryRankModel];
    updated[index][field] = value;

    if (field === 'category_id') {
      updated[index]['artist_id'] = ''; // Clear artist selection when category changes
      setCategoryRankModel(updated); // Trigger re-render
      await fetchArtistsByCategory(value, index); // Fetch artists for the selected category
    } else {
      setCategoryRankModel(updated);
    }
  };

  // Remove category rank model field
  const handleRemoveField = (index) => {
    if (categoryRankModel.length === 1) return; // Prevent removal if only one field exists
    const updated = categoryRankModel.filter((_, i) => i !== index);
    setCategoryRankModel(updated);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    const body = {
      session_name: sessionName,
      session_rank: parseInt(sessionRank),
      categoryRankModel: categoryRankModel.map(({ artist_id, artists, ...rest }) => ({
        ...rest,
        artist_id: artist_id, // Map artist_id correctly to user_id
      })),
    };
console.log(body)
    axios
      .post('http://35.154.161.226:5000/api/session-rank', body)
      .then(() => {
        alert('Session Rank Added!');
        setSessionName('');
        setSessionRank('');
        setCategoryRankModel([{ category_id: '', artist_id: '', artist_rank: '' }]);
        navigate('/category-artist'); 
      })
      .catch((error) => {
        console.error('Error adding session:', error.response?.data || error.message);
        alert('Failed to add session');
      });
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className=" mb-4">
        <h2 className="fw-bold text-main">Add Session Rank</h2>
        
      </div>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Session Name</Form.Label>
          <Form.Control
            type="text"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            placeholder="Enter session name"
            className='custom-placeholder'
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Session Rank</Form.Label>
          <Form.Control
            type="number"
            value={sessionRank}
            onChange={(e) => setSessionRank(e.target.value)}
            placeholder="Enter session rank"
             className='custom-placeholder'
          />
        </Form.Group>

        <hr />
        <h5>Category Rank Model</h5>

        {categoryRankModel.map((item, index) => (
          <div key={index} className="border p-3 mb-3 rounded position-relative">
            <Button
              variant="light"
              size="sm"
              onClick={() => handleRemoveField(index)}
              className="position-absolute top-0 end-0 m-2"
            >
              ❌
            </Button>

            <Form.Group className="mb-2">
              <Form.Label>Category</Form.Label>
              <Form.Select
              className='bg-main text-main'
                value={item.category_id}
                onChange={(e) => handleChange(index, 'category_id', e.target.value)}
              >
                <option value="" className='bg-main text-main'>-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id} className='bg-main text-main'>
                    {cat.category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

           <Form.Group className="mb-2 text-main ">
  <Form.Label>Select Artist</Form.Label>
 <Select
  options={item.artists?.map((artist) => ({
    value: artist.user_id,
    label: `${artist.profile_name} (${artist.user_id})`,
  }))}
  value={item.artist_id
    ? {
        value: item.artist_id,
        label: `${item.artists?.find(a => a.user_id === item.artist_id)?.profile_name || ''} (${item.artist_id})`
      }
    : null
  }
  onChange={(selected) =>
    handleChange(index, 'artist_id', selected ? selected.value : '')
  }
  isClearable
  placeholder="Search and select artist"
  styles={{
    control: (base) => ({
      ...base,
      backgroundColor: '#fef3c7', // replace with bg-main
      color: '#1f2937', // replace with text-dark
      borderRadius: '0.5rem',
      borderColor: '#d1d5db',
    }),
    singleValue: (base) => ({
      ...base,
      color: '#1f2937', 
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: '#fef3c7',
      color: '#1f2937',
    }),
  }}
/>
</Form.Group>


            <Form.Group>
              <Form.Label>Artist Rank</Form.Label>
              <Form.Control
                type="number"
                value={item.artist_rank}
                onChange={(e) => handleChange(index, 'artist_rank', e.target.value)}
              />
            </Form.Group>
          </div>
        ))}

        <Button variant="secondary" onClick={handleAddField} className="mb-3">
          Add More Artists
        </Button>

        <div>
          <Button className='bg-main' onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CategoryArtistAdd;

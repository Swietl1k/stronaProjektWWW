import Navbar from "../components/Navbar";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CreateFirstPage.css";
import { categories } from "../components/categories";

function Create() {
    const [category, setCategory] = useState('');
    const [rankingTitle, setrankingTitle] = useState('');
    const [rankingImage, setrankingImage] = useState<File | null>(null);
    const [imageUploaded, setImageUploaded] = useState(false);

    const [description, setDescription] = useState('');

    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            setrankingImage(file);
            setImageUploaded(true);
        } else {
            alert('Please upload an image in JPEG or PNG format.');
        }
    };

    const validateForm = () => {
        if (!category) {
            alert('Please select a category.');
            return false;
        }
        if (!rankingTitle) {
            alert('Please enter a ranking title.');
            return false;
        }

        if (!description) {
            alert('Please enter a description.');
            return false;
        }

        if (!rankingImage) {
            alert('Please upload an image.');
            return false;
        }
        return true;
    };

    const handleNextPage = () => {
        if (validateForm()) { 
            if (rankingImage) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64Image = reader.result as string;
                    localStorage.setItem('savedImage', base64Image); 
                    navigate('/create-two');
                };
                reader.readAsDataURL(rankingImage);
            }
            localStorage.setItem('category', category);
            localStorage.setItem('rankingTitle', rankingTitle);
            localStorage.setItem('description', description);
        }
    };

    const handleImageRemove = () => {
        setrankingImage(null);
        setImageUploaded(false);    
        localStorage.removeItem('savedImage');
    };
    
    useEffect(() => {
        const savedCategory = localStorage.getItem('category');
        const savedTitle = localStorage.getItem('rankingTitle');
        const savedDescription = localStorage.getItem('description');
        const savedImage = localStorage.getItem('savedImage');


        if (savedCategory) {
            setCategory(savedCategory);
        }
        if (savedTitle) {
            setrankingTitle(savedTitle);
        }

        if (savedDescription) {
            setDescription(savedDescription);
        }

        if (savedImage) {
            fetch(savedImage) 
              .then(res => res.blob()) 
              .then(blob => {
                  const file = new File([blob], 'savedImage', { type: 'image/jpeg' });
                  setrankingImage(file);
                  setImageUploaded(true);
              });
        }
    }, []);

   
    useEffect(() => {
        localStorage.setItem('category', category);
    }, [category]);

    useEffect(() => {
        localStorage.setItem('rankingTitle', rankingTitle);
    }, [rankingTitle]);

    useEffect(() => {
        localStorage.setItem('description', description); 
    }, [description]);

    useEffect(() => {
        if (rankingImage) {
            const reader = new FileReader();
            reader.onloadend = () => {
                localStorage.setItem('savedImage', reader.result as string); 
            };
            reader.readAsDataURL(rankingImage);
        }
    }, [rankingImage]);

    return (
        <div>
            <Navbar onSearchTerm={() => {}}/>
            <div className="main-container">
                <div className="left-container">
                    <div className="navigation-buttons">
                        <button className="active-button" >Step 1</button>
                        <button className="step-two-button" onClick={handleNextPage}>Step 2</button>
                    </div>
                    <div className="lo-header">
                        <div className="text">Create Ranking - Step 1</div>
                        <div className="underline"></div>
                    </div>
                    <div className="lo-inputs">
                        <div className="input">
                            <select
                                className="select-input"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Select a category</option>
                                {categories
                                .filter(cat=>cat !="All")
                                .map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input">
                            <input
                                type="text"
                                className="text-input"
                                value={rankingTitle}
                                onChange={(e) => setrankingTitle(e.target.value)}
                                placeholder="Enter ranking title"
                            />
                        </div>
                        <div className="input">
                            <input
                                type="text"
                                className="text-input"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter ranking description"
                            />
                        </div>
                        <div className={`input file-input-container ${imageUploaded ? 'image-uploaded' : ''}`}>
                            <label htmlFor="file-upload" className="file-upload-label">
                                Click to upload image
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                className="file-input"
                                accept="image/jpeg, image/png"
                                onChange={handleImageChange}
                            />
                            
                        </div>
                        <button className="lo-submit" onClick={handleNextPage}>Next</button>
                    </div>
                </div>
                <div className="right-container">
                    <h2>Preview</h2>
                    <p>Category: <strong>{category}</strong></p>
                    <p>Title: <strong>{rankingTitle}</strong></p>
                    <p>Description: <strong>{description}</strong></p>
                    {!imageUploaded && (
                        <p>Image:</p>
                    )}
                    {rankingImage && (
                        <div className="image-and-button">
                            <img src={URL.createObjectURL(rankingImage)} alt="Preview" className="image-preview" />
                            <button className="remove-button" onClick={handleImageRemove}>
                                Remove Image
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Create;

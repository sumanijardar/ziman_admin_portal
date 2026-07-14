import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Style.css';
import api from '../../services/api';
import Swal from 'sweetalert2';

const FaqAdd = () => {
    const navigate = useNavigate();
    const [parents, setParents] = useState([]);
    const [formData, setFormData] = useState({
        question: '',
        parent_id: '0',
        answer: '',
        sort_order: '0',
        is_active: '1'
    });

    useEffect(() => {
        // Fetch parents for dropdown
        const fetchParents = async () => {
            try {
                const response = await api.get("/faq/parents");
                // Adjust based on how actual API returns data
                const data = response.data?.data || response.data || [];
                if (Array.isArray(data)) {
                    setParents(data);
                }
            } catch (error) {
                console.error("Error fetching parents:", error);
            }
        };

        fetchParents();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formdata = new FormData();
        formdata.append("question", formData.question);
        formdata.append("parent_id", formData.parent_id);
        formdata.append("answer", formData.answer);
        formdata.append("sort_order", formData.sort_order);
        formdata.append("is_active", formData.is_active);

        try {
            const response = await api.post("/faq/add", formdata);
            const result = response.data;

            console.log("API Result:", result);

            if (result.status === "success" || result.code === 200 || result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: result.message || "FAQ added successfully.",
                    confirmButtonColor: '#3085d6'
                }).then(() => {
                    navigate('/faq');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message || "Error adding FAQ.",
                    confirmButtonColor: '#d33'
                });
            }
        } catch (error) {
            console.error("API error:", error);
            const errorMessage = error.response?.data?.message || "An error occurred while adding the FAQ.";
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
                confirmButtonColor: '#d33'
            });
        }
    };

    return (
        <div className="content-body">
            <div className="container-fluid">
                <div className="zf-container">
                    <div className="zf-card">
                        <h2 className="zf-title">Add New FAQ</h2>
                        <form onSubmit={handleSubmit} className="zf-form-grid">

                            <div className="zf-section-title">FAQ Details</div>


                            <div className="zf-input-group">
                                <label className="zf-label">Parent FAQ</label>
                                <select name="parent_id" value={formData.parent_id} onChange={handleChange} className="zf-select">
                                    <option value="0">Root Level (None)</option>
                                    {parents.map((parent) => (
                                        <option key={parent.id} value={parent.id}>
                                            {parent.question}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <div className="zf-input-group">
                                <label className="zf-label">Sort Order</label>
                                <input
                                    type="number"
                                    name="sort_order"
                                    value={formData.sort_order}
                                    onChange={handleChange}
                                    className="zf-input"
                                />
                            </div>

                            <div className="zf-input-group zf-full-width">
                                <label className="zf-label">Question</label>
                                <input
                                    type="text"
                                    name="question"
                                    value={formData.question}
                                    onChange={handleChange}
                                    className="zf-input"
                                    required
                                    placeholder="Enter the question"
                                />
                            </div>





                            <div className="zf-input-group zf-full-width">
                                <label className="zf-label">Answer</label>
                                <textarea
                                    name="answer"
                                    value={formData.answer}
                                    onChange={handleChange}
                                    className="zf-textarea"
                                    rows="5"
                                    placeholder="Enter the answer (optional for parent nodes)"
                                ></textarea>
                            </div>

                            <div className="zf-input-group">
                                <label className="zf-label">Status</label>
                                <select name="is_active" value={formData.is_active} onChange={handleChange} className="zf-select" required>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>

                            <button type="submit" className="zf-submit-btn">
                                Submit Details
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FaqAdd;

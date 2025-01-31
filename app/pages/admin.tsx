"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from '../components/editor';

export default function AdminPage() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [faqs, setFaqs] = useState<any[]>([]); // State to store FAQs

    // Fetch FAQs when the page loads
    const fetchFAQs = async () => {
        try {
            const response = await axios.get('/api/faqs');
            setFaqs(response.data); // Store fetched FAQs in state
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        }
    };

    useEffect(() => {
        fetchFAQs(); // Fetch FAQs on initial render
    }, []);

    // Create FAQ
    const handleSubmit = async () => {
        try {
            const response = await axios.post('/api/faqs', { question, answer });
            alert('FAQ added!');
            setQuestion('');
            setAnswer('');
            fetchFAQs(); // Reload FAQs after new one is created
        } catch (error) {
            console.error('Error adding FAQ:', error);
            alert('Failed to add FAQ');
        }
    };

    // Delete FAQ
    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/faqs?id=${id}`);
            alert('FAQ deleted!');
            fetchFAQs(); // Reload FAQs after deletion
        } catch (error) {
            console.error('Error deleting FAQ:', error);
            alert('Failed to delete FAQ');
        }
    };

    return (
        <div>
            <h1>Manage FAQs</h1>
            <div>
                <h2>Add FAQ</h2>
                <input
                    type="text"
                    placeholder="Question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <Editor value={answer} onChange={setAnswer} />
                <button onClick={handleSubmit}>Submit</button>
            </div>

            <h2>Existing FAQs</h2>
            <ul>
                {faqs.length > 0 ? (
                    faqs.map((faq) => (
                        <li key={faq.id}>
                            <div>
                                <strong>Q: {faq.question}</strong>
                                <p>A: {faq.answer}</p>
                                <button onClick={() => handleDelete(faq.id)}>Delete</button>
                            </div>
                        </li>
                    ))
                ) : (
                    <p>No FAQs available.</p>
                )}
            </ul>
        </div>
    );
}

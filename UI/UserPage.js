import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Typography, TextField, Container, Box, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

const UserPage = () => {
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [blogContent, setBlogContent] = useState("");
    const navigate = useNavigate();

    const getSavedBlogs = () => {
        const savedBlogs = localStorage.getItem("savedBlogs");
        return savedBlogs ? JSON.parse(savedBlogs) : [];
    };

    const saveBlog = () => {
        if (blogContent) {
            const savedBlogs = getSavedBlogs();
            const newBlog = {
                id: Date.now(),
                topic: topic,
                content: blogContent,
                date: new Date().toLocaleString(),
                likes: 0,
                dislikes: 0,
            };
            savedBlogs.push(newBlog);
            localStorage.setItem("savedBlogs", JSON.stringify(savedBlogs));
            setBlogContent("");
        }
    };

    const handleLike = (id) => {
        const savedBlogs = getSavedBlogs();
        const updatedBlogs = savedBlogs.map((blog) =>
            blog.id === id ? { ...blog, likes: blog.likes + 1 } : blog
        );
        localStorage.setItem("savedBlogs", JSON.stringify(updatedBlogs));
        window.location.reload();
    };

    const handleDislike = (id) => {
        const savedBlogs = getSavedBlogs();
        const updatedBlogs = savedBlogs.map((blog) =>
            blog.id === id ? { ...blog, dislikes: blog.dislikes + 1 } : blog
        );
        localStorage.setItem("savedBlogs", JSON.stringify(updatedBlogs));
        window.location.reload();
    };

    const clearLocalStorage = () => {
        localStorage.removeItem("savedBlogs");
        window.location.reload();
    };

    const generateBlog = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic }),
            });
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setBlogContent(data.blog);
        } catch (error) {
            console.error("Error generating blog:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 5 }}>
                <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                    <Typography variant="h3" align="center" gutterBottom>
                        AI Blog Generator
                    </Typography>
                    <Box display="flex" justifyContent="center" gap={2}>
                        <TextField
                            label="Enter a topic"
                            variant="outlined"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            fullWidth
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={generateBlog}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : "Generate"}
                        </Button>
                    </Box>
                </motion.div>

                {blogContent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.03, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)" }}
                    >
                        <Card sx={{ mt: 3, p: 2, transition: "background 0.3s", "&:hover": { background: "#f5f5f5" } }}>
                            <CardContent>
                                <Typography variant="h5">Generated Blog</Typography>
                                <Typography>{blogContent}</Typography>
                                <Button variant="contained" color="warning" onClick={saveBlog} sx={{ mt: 2 }}>
                                    Save Blog
                                </Button>
                                <Button variant="contained" color="success" onClick={() => navigate("/viewer")} sx={{ mt: 2, ml: 1 }}>
                                    View All Blogs
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {getSavedBlogs().length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <Typography variant="h5" sx={{ mt: 4 }}>
                            Saved Blogs
                        </Typography>
                        {getSavedBlogs().map((blog) => (
                            <motion.div
                                key={blog.id}
                                whileHover={{
                                    scale: 1.03,
                                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)", // Glow effect
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card
                                    sx={{
                                        mt: 2,
                                        p: 2,
                                        transition: "background 0.3s",
                                        background: "linear-gradient(135deg, #ffffff, #f8f9fa)",
                                        "&:hover": { background: "linear-gradient(135deg, #ffffff, #e3e8ef)" },
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6">{blog.topic}</Typography>
                                        <Typography>{blog.content}</Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {blog.date}
                                        </Typography>
                                        <Box mt={2} display="flex" gap={1}>
                                            <Button variant="contained" color="success" onClick={() => handleLike(blog.id)}>
                                                👍 {blog.likes}
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => handleDislike(blog.id)}>
                                                👎 {blog.dislikes}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <Button variant="contained" color="secondary" onClick={clearLocalStorage} sx={{ mt: 2, ml: 1 }}>
                    Clear Storage
                </Button>
            </Container>
        </>
    );
};

export default UserPage;

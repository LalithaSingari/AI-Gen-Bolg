import React from "react";
import { Container, Typography, Paper, Box } from "@mui/material";
import { motion } from "framer-motion"; 
import Navbar from "./Navbar"; 

const ViewerPage = () => {
    const savedBlogs = JSON.parse(localStorage.getItem("savedBlogs")) || [];

    return (
        <Box sx={{ background: "linear-gradient(to right, #ece9e6, #ffffff)", minHeight: "100vh", pb: 4 }}>
            <Navbar /> 
            <Container maxWidth="md" sx={{ pt: 4 }}>
                <Typography variant="h3" align="center" gutterBottom>
                    All Saved Blogs
                </Typography>

                {savedBlogs.length > 0 ? (
                    savedBlogs.map((blog) => (
                        <motion.div
                            key={blog.id}
                            whileHover={{
                                scale: 1.03, 
                                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)", 
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 3,
                                    my: 2,
                                    borderRadius: 2,
                                    background: "linear-gradient(135deg, #ffffff, #f8f9fa)", 
                                    transition: "background 0.3s",
                                    "&:hover": {
                                        background: "linear-gradient(135deg, #ffffff, #dbe2ef)", 
                                    },
                                }}
                            >
                                <Typography variant="h5" color="primary" gutterBottom>
                                    {blog.topic}
                                </Typography>
                                <Typography variant="body1" paragraph>
                                    {blog.content}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {blog.date}
                                </Typography>
                            </Paper>
                        </motion.div>
                    ))
                ) : (
                    <Typography variant="h6" align="center" color="textSecondary">
                        No blogs saved yet.
                    </Typography>
                )}
            </Container>
        </Box>
    );
};

export default ViewerPage;

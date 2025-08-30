import React, { useEffect } from "react";
import {useNavigate, useRoutes} from 'react-router-dom'

// Pages List
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepository from "./components/repository/CreateRepository";
import RepositoryView from "./components/repository/RepositoryView";


// Auth Context
import { useAuth } from "./authContext";

const ProjectRoutes = ()=>{
    const {currentUser, setCurrentUser} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        const userIdFromStorage = localStorage.getItem("userId");

        if(userIdFromStorage && !currentUser){
            setCurrentUser(userIdFromStorage);
        }

        // Only redirect if not on auth pages and no user
        if(!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname))
        {
            navigate("/auth");
        }

        // Redirect to dashboard if user is logged in and on auth page
        if(userIdFromStorage && window.location.pathname=='/auth'){
            navigate("/");
        }
    }, [currentUser, navigate, setCurrentUser]);

    let element = useRoutes([
        {
            path:"/",
            element:<Dashboard/>
        },
        {
            path:"/auth",
            element:<Login/>
        },
        {
            path:"/signup",
            element:<Signup/>
        },
        {
            path:"/profile",
            element:<Profile/>
        },
        {
            path:"/create",
            element:<CreateRepository/>
        },
        {
            path:"/repo/:id",
            element:<RepositoryView/>
        }
    ]);

    return element;
}

export default ProjectRoutes;
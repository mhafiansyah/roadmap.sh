import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "react-router";
import type { IBlog } from "../types";
import { authClient } from "./auth-client";

export const blogsListLoader = async () => {
    const response = await fetch('http://localhost:3000/home');
    if (!response.ok) throw new Error('Failed to fetch blogs list');
    const data = await response.json() as IBlog[];

    return data;
}

export const blogDetailLoader = async({params}: LoaderFunctionArgs) => {
    const response = await fetch(`http://localhost:3000/article/${params.id}`);
    if (!response.ok) throw new Error('Failed to fetch blog detail');
    const data = await response.json() as IBlog;

    return data;
}

export const loginAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const { error } = await authClient.signIn.email({
            email,
            password,
            callbackURL: '/admin',
        })

        if (error) {
            console.log('login error');
            throw new Error('login failed');
        }
    } catch (error) {
        return {error: 'Could not connect to the server'};
    }
}

export const loginLoader = async () => {
    const { data: session } = await authClient.getSession();
    if (session) return redirect('/admin');
    return null;
}

export const logout = async() => {
    await authClient.signOut();
    return redirect('/home');
}

export const adminLoader = async() => {
    const { data: session } = await authClient.getSession();

    if(!session) return redirect('/login');

    const response = await fetch('http://localhost:3000/admin', {
        credentials: "include",
        method: "get",
    });

    if (response.status === 401) return redirect('/login');
    if (!response.ok) throw new Error('failed to fetch admin blog list');
    const dataJSON = await response.json() as IBlog[];

    return dataJSON;
}

export const addBlogAction = async({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const title = formData.get('title');
    const content = formData.get('content');

    const response = await fetch('http://localhost:3000/admin/new/article', {
        method: 'post',
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({title, content}),
        credentials: 'include',
    });

    if(!response.ok) throw new Error('failed to add blog');
        
    return redirect('/admin');
}

export const deleteBlogLoader = async({params}: LoaderFunctionArgs) => {
    const response = await fetch(`http://localhost:3000/admin/delete/article/${params.id}`, {
        method: 'delete',
        headers: {
            'content-type': 'application/json',
        },
        credentials: 'include',
    });
    if(!response.ok) throw new Error(`failed to delete blog ${params.id}`);
        
    return redirect('/admin');
}

export const editBlogAction = async({request, params}: ActionFunctionArgs) => {
    const formData = await request.formData();
    const title = formData.get('title');
    const content = formData.get('content');

    const response = await fetch(`http://localhost:3000/admin/edit/article/${params.id}`, {
        method: 'post',
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({title, content}),
        credentials: 'include',
    });

    if(!response.ok) throw new Error(`failed to edit blog`);

    return redirect('/admin');
}

export const editBlogLoader = async({params}: LoaderFunctionArgs) => {
    const response = await fetch(`http://localhost:3000/article/${params.id}`);

    if(!response.ok) throw new Error(`failed to fetch data for blog ${params.id}`)

    const data = await response.json() as IBlog;
    return data;
}
import { Link, useLoaderData } from "react-router"
import type { IBlog } from "../types"
import { authClient } from "../services/auth-client";

export const BlogDetail = () => {
    const blog = useLoaderData() as IBlog;
    const { data: session } = authClient.useSession();

    const backLink = session ? '/admin' : '/home';
    return (
        <div>
            <p style={{display: "flex", justifyContent: "space-between"}}>
                <Link to={backLink}>Back</Link>
                <span>
                    {session && (
                        <>
                            <Link to={`/admin/edit/article/${blog.id}`} style={{marginRight: '10px'}}>Edit</Link>
                            <Link to={`/admin/delete/article/${blog.id}`}>Delete</Link>
                        </>
                    )}
                </span>
            </p>
            
            <h1 style={{ color: 'oklch(90.57% 0.149 189.59)'}}>{blog.title}</h1>
            <span style={{fontSize: '0.8em'}}>created at {blog.createdAt.split('T')[0]}</span><br/>
            <span style={{fontSize: '0.8em'}}>last update at {blog.updatedAt.split('T')[0]}</span>
            <p className="blog-content">{blog.content}</p>
        </div>
    )
}
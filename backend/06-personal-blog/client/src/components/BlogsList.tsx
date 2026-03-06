import { Link, useLoaderData } from "react-router"
import type { IBlog } from "../types";

export const BlogsList = () => {
    const blogs = useLoaderData() as IBlog[];

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1>Personal Blog</h1>
            <ul style={{listStyle: "none", padding: 0, margin: 0, width: '400px'}}>
                {blogs.map((blog) => {
                    return (
                        <Link to={`/article/${blog.id}`}>
                            <li key={blog.id} style={{display: "flex", justifyContent: "space-between"}}>
                                <p>{blog.title}</p>
                                <p className="muted-color">{blog.createdAt.split('T')[0]}</p>
                            </li>
                        </Link>
                    )
                })}
            </ul>
        </div>
    )
}
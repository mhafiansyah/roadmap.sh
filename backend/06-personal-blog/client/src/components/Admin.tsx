import { Link, useLoaderData } from "react-router"
import type { IBlog } from "../types"

export const Admin = () => {
    const blogs = useLoaderData() as IBlog[];

    return (
        <div>
            <Link to={'/logout'}>Logout</Link>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <h1>Personal Blog</h1>
                <Link to={`new/article`}>+ Add</Link>
            </div>          
            <ul style={{listStyle: "none", padding: 0, margin: 0, width: '400px', display: "flex", gap: '20px', flexDirection: 'column'}}>
                {blogs.map((blog => {
                    return (
                        <li key={blog.id} style={{ display: "flex", justifyContent: "space-between"}}>
                            <Link to={`/article/${blog.id}`}>{blog.title}</Link>
                            <div>
                                <Link to={`edit/article/${blog.id}`}><span className="muted-color" style={{ marginRight: '1em'}}>Edit</span></Link>
                                <Link to={`delete/article/${blog.id}`}><span className="muted-color">Delete</span></Link>
                            </div>
                        </li>
                    )
                }))}
            </ul>
        </div>
    )
}
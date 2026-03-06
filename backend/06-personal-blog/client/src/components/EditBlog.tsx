import { Form, Link, useLoaderData } from "react-router"
import type { IBlog } from "../types"

export const EditBlog = () => {
    const blog = useLoaderData() as IBlog
    return (
        <div>
            <p><Link to='/admin'>Back</Link></p>
            <h1>Personal Blog - Edit Blog</h1>
            <Form method="post" style={{display: "flex", flexDirection: "column", gap: '5px'}}>
                <label>Title</label>
                <input name='title' defaultValue={blog.title} required/>
                <label>Content</label>
                <textarea name='content' defaultValue={blog.content} required/>
                <button type='submit'>Edit</button>
            </Form>
        </div>
    )
}
import { Form, Link } from "react-router"

export const AddBlog = () => {
    return (
        <div>
            <p><Link to='/admin'>Back</Link></p>
            <h1> Personal Blog - Add Blog</h1>
            <Form method="post" style={{display: "flex", flexDirection: "column", gap: '5px'}}>
                <label>Title</label>
                <input name='title' required/>
                <label>Content</label>
                <textarea name='content' required/>
                <button type='submit'>Publish</button>
            </Form>
        </div>
    )
}
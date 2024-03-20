const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api=supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [ 
    {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
    },
    {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5
    },
    {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12
  }]

beforeEach(async ()=>{
    await Blog.deleteMany({})
    
    await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async ()=>{
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}
)

test('all blogs are returned',async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('there are three blogs', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(3)

})

test('a valid blog can be added', async ()=>{
    const newBlog = {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    
    const contents = response.body.map(r => r.title)

    expect(response.body).toHaveLength(initialBlogs.length+1)
    expect(contents).toContainEqual(
        'First class tests'
    )

})

afterAll(async () => {
    await mongoose.connection.close()
})
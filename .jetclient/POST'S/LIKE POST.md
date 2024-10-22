```toml
name = 'LIKE POST'
method = 'PUT'
url = '{{baseUrl}}/posts/6717528cc46d5c193ff33b6e/like-status'
sortWeight = 8000000
id = '2e6e0df7-4985-49aa-b6b9-820805a0d09c'

[auth.bearer]
token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFnaGFydHVyQGdtYWlsLmNvbSIsImxvZ2luIjoiYXJ0dXItdGVzdCIsInN1YiI6IjY3MTdiMzhlZmUwODBmNGZjNTU4NTViNSIsImlhdCI6MTcyOTYxNjcwMywiZXhwIjoxNzI5NjM0NzAzfQ.SB4i6boYNU23JxOyeULUyW-csjK_ebazpWoFZkmZHdU'

[body]
type = 'JSON'
raw = '''
{
  "likeStatus": "Like"
}'''
```

```toml
name = 'CREATE POST'
method = 'POST'
url = '{{baseUrl}}/posts'
sortWeight = 3000000
id = '3233f002-7483-4553-9ade-34fcdf9ce1ab'

[auth.basic]
username = 'admin'
password = 'qwerty'

[body]
type = 'JSON'
raw = '''
{
  "title": "TEST POST",
  "content": "content_wY80",
  "blogId": "671a1ac79a8f643f1671bdeb",
  "shortDescription": "shortDescription_cE47"
}'''
```

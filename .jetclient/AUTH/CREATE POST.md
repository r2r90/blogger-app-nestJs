```toml
name = 'CREATE POST'
method = 'POST'
url = '{{baseUrl}}/posts'
sortWeight = 3000000
id = 'ecb7304b-0183-486a-9225-3465261ad841'

[auth.basic]
username = 'admin'
password = 'qwerty'

[body]
type = 'JSON'
raw = '''
{
  "title": "new test POST",
  "shortDescription": "qpsldj qsdpkdqskndsq dqskqsdjqsdkjqsdk",
  "content": "https://my-test.com",
  "blogId": "67164994f1e0d5fadda1063c"
}'''
```

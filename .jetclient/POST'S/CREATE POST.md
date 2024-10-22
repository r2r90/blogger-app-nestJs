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
  "title": "new test POST",
  "shortDescription": "qpsldj qsdpkdqskndsq dqskqsdjqsdkjqsdk",
  "content": "https://my-test.com",
  "blogId": "67164994f1e0d5fadda1063c"
}'''
```

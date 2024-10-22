```toml
name = 'CREATE BLOG'
method = 'POST'
url = '{{baseUrl}}/blogs'
sortWeight = 3000000
id = '3233f002-7483-4553-9ade-34fcdf9ce1ab'

[auth.basic]
username = 'admin'
password = 'qwerty'

[body]
type = 'JSON'
raw = '''
{
  "name": "new test blog",
  "description": "qpsldj qsdpkdqskndsq dqskqsdjqsdkjqsdk",
  "websiteUrl": "https://my-test.com"
}'''
```

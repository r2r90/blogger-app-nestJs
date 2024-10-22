```toml
name = 'UPDATE BLOG'
method = 'PUT'
url = '{{baseUrl}}/blogs/67164994f1e0d5fadda1063c'
sortWeight = 4000000
id = 'a5c19cfd-04dc-4d32-8bb8-7efc7da271c7'

[auth.basic]
username = 'admin'
password = 'qwerty'

[body]
type = 'JSON'
raw = '''
{
  "name": "new test blog",
  "description": "TEST TEST dqskqsdjqsdkjqsdk",
  "websiteUrl": "https://my-test.com"
}'''
```

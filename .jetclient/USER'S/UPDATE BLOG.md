```toml
name = 'UPDATE BLOG'
method = 'PUT'
url = '{{baseUrl}}/blogs/67164994f1e0d5fadda1063c'
sortWeight = 4000000
id = '3ed579ec-af09-4255-9199-b06f0f19196f'

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

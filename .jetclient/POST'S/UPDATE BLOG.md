```toml
name = 'UPDATE BLOG'
method = 'PUT'
url = '{{baseUrl}}/blogs/67164994f1e0d5fadda1063c'
sortWeight = 4000000
id = '4e2ec756-dd11-4885-9418-65e4100d6c78'

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

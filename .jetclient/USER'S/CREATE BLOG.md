```toml
name = 'CREATE BLOG'
method = 'POST'
url = '{{baseUrl}}/blogs'
sortWeight = 3000000
id = 'bab1dc51-51a3-4305-a227-7a049b56a3da'

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

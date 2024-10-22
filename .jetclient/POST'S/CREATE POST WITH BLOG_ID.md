```toml
name = 'CREATE POST WITH BLOG:ID'
method = 'POST'
url = '{{baseUrl}}/blogs/67164994f1e0d5fadda1063c/posts'
sortWeight = 6000000
id = 'e1112b65-83eb-4c69-b199-c782fd8c5161'

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

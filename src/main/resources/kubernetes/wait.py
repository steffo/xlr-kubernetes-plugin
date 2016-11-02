import time
import re
from kubernetes.api_client import APIClient

command=task.pythonScript.getProperty('command')
pattern=task.pythonScript.getProperty('pattern')
wait_in_sec=task.pythonScript.getProperty('waitInSeconds')
retry_count=task.pythonScript.getProperty('retryCount')
kube_ctl_path=task.pythonScript.getProperty('kubectlPath')

host = task.pythonScript.getProperty("host")
client = APIClient(host, kube_ctl_path)
match=False
for num in range(0,retry_count):
    time.sleep(wait_in_sec)
    response = client.execute_command(command)
    output = response.stdout
    error = response.stderr
    if re.search(pattern,output,re.M):
        match=True
        break;

if not match:
    raise Exception('Regular expression not found in command output')


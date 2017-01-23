'use strict';

const kubernetesServer = 'KubernetesServer';

const timeout = 180000;

const addTaskTitle = 'KubernetesCreateTask';

const deleteTaskTitle = "KubernetesDeleteTask";

const waitTaskTitle = "KubernetesWaitTask";

const username = 'root';

const password = 'root';

const port = (process.env.HTTP_SERVER_PORT || "8001")

const url = 'http://localhost:' + port + '/pod.json';

const waitTaskCommand = 'kubectl describe pods/myapp';

const waitTaskPattern = 'Status:[\\s]*Running';

const json = {
    kind: 'Pod',
    apiVersion: 'v1',
    metadata: {
        name: 'myapp',
        namespace: 'default',
        labels: {
            name: 'myapp'
        }
    },
    spec: {
        containers: [{
            name: 'myapp',
            image: 'nginx',
            ports: [{containerPort: 80}]
        }]
    }
};

const jsonTaskConfig = { "json": json};

const waitTaskConfig = { "wait": {"command": waitTaskCommand, "pattern": waitTaskPattern}};

const urlTaskConfig = { "url": url, "username": username, "password": password};

describe('kubernetes create task', () => {
    beforeAll(()=>{
        LoginPage.login('admin', 'admin');
    });

    afterAll(()=>{
        LoginPage.logout();
    });

    beforeEach(() => {
        fixtures().release({
            id: 'ReleaseWithKubeCreateTask',
            title: 'ReleaseWithKubernetesCreateTask',
            description: 'ReleaseWithKubernetesCreateTask',
            status: 'planned',
            phases: [
                {
                    title: 'Phase',
                    status: 'PLANNED',
                    tasks: []
                }
            ]
        });
        Page.openConfiguration()
            .addNewInstance('Add Unix Host')
            .setTextField('title', kubernetesServer)
            .setTextField('address', 'overthere-xlr-itest.xebialabs.com')
            .setTextField('port', '22')
            .setTextField('username', 'vagrant')
            .setTextField('password', 'vagrant')
            .setTextField('sudoUsername', 'root')
            .save();
        Page.openRelease('ReleaseWithKubeCreateTask');
    });

    afterEach(() => {
        fixtures().clean();
        Page.openConfiguration().deleteInstance(kubernetesServer);
    });

    it('should create and remove kubernetes resource with json', () => {
        utils.addFirstTask(addTaskTitle, 'kubernetes.createConf')
             .configureTask(addTaskTitle, jsonTaskConfig)
             .addAnotherTask(waitTaskTitle, 'kubernetes.wait')
             .configureTask(waitTaskTitle, waitTaskConfig)
             .addAnotherTask(deleteTaskTitle, 'kubernetes.removeConf')
             .configureTask(deleteTaskTitle, jsonTaskConfig)
             .startReleaseAndWait(timeout);

        utils.assertOutput(addTaskTitle, 'pod \"myapp\" created')
             .assertOutput(deleteTaskTitle, 'pod \"myapp\" deleted');
    });

    it('should create and remove kubernetes resource with url config', () => {

        utils.addFirstTask(addTaskTitle, 'kubernetes.createConf')
             .configureTask(addTaskTitle, urlTaskConfig)
             .addAnotherTask(waitTaskTitle, 'kubernetes.wait')
             .configureTask(waitTaskTitle, waitTaskConfig)
             .addAnotherTask(deleteTaskTitle, 'kubernetes.removeConf')
             .configureTask(deleteTaskTitle, urlTaskConfig)
             .startReleaseAndWait(timeout);

        utils.assertOutput(addTaskTitle, 'pod \"myapp\" created')
             .assertOutput(deleteTaskTitle, 'pod \"myapp\" deleted');
    });
});

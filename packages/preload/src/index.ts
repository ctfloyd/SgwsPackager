import { ipcRenderer, contextBridge } from 'electron';
import IpcEvents from '../../common/ipc-events';

const validChannels = Object.values(IpcEvents);

contextBridge.exposeInMainWorld(
    'api',
    {
        send: (channel: IpcEvents, data: any) => {
            if(validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        on: (channel: IpcEvents, callback: any) => {
            if(validChannels.includes(channel)) {
                const newCallback = (_: any, data: any) => callback(data);
                ipcRenderer.on(channel, newCallback);
            }
        }

    }
)


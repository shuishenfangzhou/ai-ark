#!/usr/bin/env python3
import paramiko
import os
import glob

# 配置
HOST = '47.96.82.66'
PORT = 22
USER = 'root'
PASSWORD = '210981040436Fhz'
REMOTE_DIR = '/opt/1panel/apps/openresty/openresty/www/sites/my-ai-site/index'
LOCAL_DIR = 'D:/AI工具箱/dist'

def upload_dir(sftp, local_path, remote_path):
    """递归上传目录"""
    os.chdir(os.path.dirname(local_path))
    folder_name = os.path.basename(local_path)
    
    # 创建远程目录
    try:
        sftp.mkdir(remote_path)
    except:
        pass
    
    for item in os.listdir(local_path):
        local_item_path = os.path.join(local_path, item)
        remote_item_path = f"{remote_path}/{item}"
        
        if os.path.isfile(local_item_path):
            print(f"上传: {item}")
            sftp.put(local_item_path, remote_item_path)
        elif os.path.isdir(local_item_path):
            print(f"创建目录: {item}")
            try:
                sftp.mkdir(remote_item_path)
            except:
                pass
            upload_dir(sftp, local_item_path, remote_item_path)

def main():
    print(f"连接服务器 {HOST}...")
    transport = paramiko.Transport((HOST, PORT))
    transport.connect(username=USER, password=PASSWORD)
    sftp = paramiko.SFTPClient.from_transport(transport)
    
    print(f"上传文件到 {REMOTE_DIR}...")
    upload_dir(sftp, LOCAL_DIR, REMOTE_DIR)
    
    sftp.close()
    transport.close()
    print("\n✅ 上传完成!")

if __name__ == "__main__":
    main()

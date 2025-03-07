const sizes = [512, 256, 128, 64, 32, 16];
const dropZone = document.getElementById('drop-zone');
const output = document.getElementById('output');

// 处理拖放事件
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', async (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  
  const file = e.dataTransfer.files[0];
  if (!file || !file.type.match('image/png')) {
    alert('请拖放PNG格式文件');
    return;
  }

  try {
    const img = await loadImage(file);
    if (img.width !== 1024 || img.height !== 1024) {
      alert('图片尺寸必须为1024x1024像素');
      return;
    }

    output.innerHTML = '';
    sizes.forEach(size => {
      createThumbnail(img, size);
    });
  } catch (error) {
    alert('图片加载失败: ' + error.message);
  }
});

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function createThumbnail(img, size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, size, size);

  const container = document.createElement('div');
  container.className = 'thumbnail';
  
  const imgElement = document.createElement('img');
  imgElement.src = canvas.toDataURL('image/png');
  
  const info = document.createElement('div');
  info.innerHTML = `${size}x${size}`;
  
  const downloadBtn = document.createElement('button');
  downloadBtn.className = 'download-btn';
  downloadBtn.textContent = '下载';
  downloadBtn.onclick = () => {
    const link = document.createElement('a');
    link.download = `icon-${size}x${size}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  container.append(imgElement, info, downloadBtn);
  output.appendChild(container);
}
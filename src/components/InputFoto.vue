<script setup>
import { ref } from 'vue';

import GlobalHelper from '@/utilities/GlobalHelper';

const {assignAlert } = GlobalHelper

const fileInput = ref(null);
const isDragOver = ref(false);
const dragText = ref("Tambahkan Foto");

const emit = defineEmits(['file-selected']);

const browseFile = () => {
  fileInput.value.click(); // Trigger file input click
};

const handleFileChange = () => {
  const file = fileInput.value.files[0];
  if (file) {
    // Emit the selected file to the parent component
    emit('file-selected', file);
  }
};

const dragEnter = () => {
  isDragOver.value = true;
  dragText.value = "Release to Upload File";
};

const dragLeave = () => {
  isDragOver.value = false;
  dragText.value = "Drag & Drop to Upload File";
};

const uploadFile = (event) => {
  // Implement file upload logic here
  // For example, axios or fetch to upload the file
  // also show the uploaded file in the preview area
  event.preventDefault();
  const files = event.dataTransfer.files;
  
  fileInput.value.files = files;
  handleFileChange();
  console.log("File dropped" + files);

  // Simulate uploading process
  setTimeout(() => {
    assignAlert(true, 'Sukses', 'success', 'File Berhasil Diupload')
  }, 1000);
};
</script>
<template>
    <div class="drag-area" 
    @click="browseFile" 
    href="#"
    @drop.prevent="uploadFile" 
    @dragover.prevent
    @dragenter="dragEnter"
    @dragleave="dragLeave"
    :class="{ 'active': isDragOver }"
    >
    <a class="browse__placeholder">
      <div ><ph-camera :size="48" weight="regular" class="icon" /></div>
      <header>{{ dragText }}</header>
        <input ref="fileInput" type="file" name="file" id="file" @change="handleFileChange" hidden>
    </a>
    </div>

  </template>

<style scoped>
.drag-area {
  border: 2px dashed #000000;
  height: 193px;
  width: 277px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.drag-area.active {
  border: 2px dashed #000000;
  background-color: #eaeaea;
}



.drag-area header {
  font-size: 15px;
  font-weight: 500;
  color: #000000;
}

.drag-area span {
  font-size: 15px;
  font-weight: 500;
  color: #000000;
  margin: 10px 0 15px 0;
}

.drag-area button {
  padding: 10px 25px;
  font-size: 20px;
  font-weight: 500;
  border: none;
  outline: none;
  background: #ffffff;
  border: 1px dotted #000000;
  color: #000000;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.5s;
}

.drag-area button:hover {
  background: rgb(228, 220, 220);
}

.drag-area img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 5px;
}

a.browse__placeholder{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

</style>

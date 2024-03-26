import { useRef, useState } from 'react';
import CloseButton from '../../Svgs/close-button.svg?react';
import './DragDropImageUploader.css';
import axios from 'axios';

function DragDropImageUploader() { //https://www.youtube.com/watch?v=b-9Hw03yzTs
	const [images, setImages] = useState([]);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef(null);

	async function uploadImages() {
		const formData = new FormData();
		images.forEach(image => {
			formData.append('files', image.file);  // Use the file object for upload
		});

		try {
			const response = await axios.post('https://localhost:5173/images/upload', formData);
			console.log(response.data); // Handle the response accordingly
		} catch (error) {
			console.error('Error:', error);
		}
	}

	function selectFiles() {
		fileInputRef.current.click();
	}
	function onFileSelect(event) {
		const files = event.target.files;
		if (files.length === 0) {
			return;
		}
		for (let i = 0; i < files.length; i++) {
			if (files[i].type.split('/')[0] !== 'image') continue;
			if (!images.some((e) => e.name === files[i].name)) {
				setImages((prevImages) => [
					...prevImages,
					{
						name: files[i].name,
						file: files[i],
						url: URL.createObjectURL(files[i]),
					},
				]);
			}
		}
	}
	function deleteImage(index) {
		setImages((prevImages) =>
			prevImages.filter((_, i) => i !== index)
		);
	}

	function onDragOver(event) {
		event.preventDefault();
		setIsDragging(true);
		event.dataTransfer.dropEffect = "copy";
	}

	function onDragLeave(event) {
		event.preventDefault();
		setIsDragging(false);
	}

	function onDrop(event) {
		event.preventDefault();
		setIsDragging(false);
		const files = event.dataTransfer.files;
		for (let i = 0; i < files.length; i++) {
			if (files[i].type.split('/')[0] !== 'image') continue;
			if (!images.some((e) => e.name === files[i].name)) {
				setImages((prevImages) => [
					...prevImages,
					{
						name: files[i].name,
						file: files[i],
						url: URL.createObjectURL(files[i]),
					},
				]);
			}
		}
	}
	return (
		<div className="card">
			<div className="top">
				<p>Drag & Drop Image uploading</p>
			</div>
			<div className='drag-area' onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} >
				{
					isDragging ? (
						<span className='select'>
							Drop images here
						</span>
					) : (
						<>
							Drag & Drop Image here or {" "}
							<span className='select' role='button' onClick={selectFiles}>
								Browse
							</span>
						</>
					)
				}
				<input name='file' type='file' className='file' multiple ref={fileInputRef} onChange={onFileSelect}></input>
			</div>
			<div className='container'>
				{images.map((images, index) => (
					<div className='image' key={index}>
						<CloseButton className='delete' onClick={() => deleteImage(index)}></CloseButton>
						<img src={images.url} alt={images.name} />
					</div>
				))}
			</div>
			<button type='button' onClick={uploadImages}>
				Upload
			</button>
		</div>
	)
}

export default DragDropImageUploader;

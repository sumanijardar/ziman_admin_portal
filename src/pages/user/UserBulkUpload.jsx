import React, { useState } from 'react';
import api from '../../services/api';

const UserBulkUpload = () => {
  const [formData, setFormData] = useState({
    tenant: '',
    startDate: '',
    days: '',
    plan: '',
    file: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.file) {
      alert("Please choose a file to upload.");
      return;
    }

    setIsLoading(true);
    try {
      const uploadData = new FormData();
      uploadData.append("file", formData.file);

      const response = await api.post("/admin/userBulkUpload", uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const processResult = (result) => {
        // Extract stats from result.summary if available, otherwise from result directly
        const summary = result.summary || result;
        const totalCount = summary.total;
        const insertedCount = summary.inserted;
        const failedCount = summary.failed;

        if (["success", "partial_success", "error"].includes(result.status)) {
          let resultType = 'success';
          if (result.status === 'partial_success') {
             resultType = 'warning';
          } else if (result.status === 'error') {
             resultType = 'error';
          }

          setUploadResult({
            type: resultType,
            message: result.message,
            total: totalCount,
            inserted: insertedCount,
            failed: failedCount,
            errors: result.errors || []
          });
          
          if (resultType === 'success' || resultType === 'warning') {
            setFormData(prev => ({ ...prev, file: null }));
          }
        } else {
          setUploadResult({
            type: 'error',
            message: result.message || "Unknown error occurred"
          });
        }
      };

      processResult(response.data);
    } catch (error) {
      console.error("Upload error:", error);
      if (error.response && error.response.data) {
        // Axios throws an error for status codes like 400, but the backend still sends the JSON payload
        const processResult = (result) => {
          const summary = result.summary || result;
          if (["success", "partial_success", "error"].includes(result.status)) {
            let resultType = 'success';
            if (result.status === 'partial_success') {
               resultType = 'warning';
            } else if (result.status === 'error') {
               resultType = 'error';
            }
            setUploadResult({
              type: resultType,
              message: result.message,
              total: summary.total,
              inserted: summary.inserted,
              failed: summary.failed,
              errors: result.errors || []
            });
          } else {
            setUploadResult({
              type: 'error',
              message: result.message || "Unknown error occurred"
            });
          }
        };
        processResult(error.response.data);
      } else {
        setUploadResult({
          type: 'error',
          message: "An error occurred during upload. Please try again."
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadSample = () => {
    // Dummy download logic
    const headers = "SAP Code (*),First Name(*), Middle Name, Last Name(*), Mobile(*), Email(*),designation,Department_Name, Gender(*), Blood Group(), Age, DOB(),Branch Code(), Emergency Contact SAP Code1(*), Emergency Contact SAP Code2(*), Emergency Contact SAP Code3(*), Emergency Contact SAP Code4(*), Employee Status(*)";
    const blob = new Blob([headers], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_user_import.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="content-body" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '30px', paddingTop: '100px' }}>
      <div className="container-fluid">
        <h3 style={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '25px' }}>User Bulk Import</h3>

        {/* Instructions Card */}
        <div className="card mb-4" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: 'none' }}>
          <div className="card-body" style={{ padding: '30px' }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
              <h5 style={{ fontWeight: 'bold', color: '#34495e', margin: 0 }}>Import CSV file only</h5>
              <button
                onClick={handleDownloadSample}
                className="mt-3 mt-md-0"
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#0056b3',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#004494'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#0056b3'}
              >
                Download Sample File
              </button>
            </div>

            <div style={{ color: '#555', fontSize: '15px', lineHeight: '1.8' }}>
              <p className="mb-2">1. The first line in downloaded csv file should remain as it is. Please do not change the order of columns in csv file.</p>
              <p className="mb-2">2. The correct column order is<br />
                <span style={{ color: '#7f8c8d', fontSize: '14px' }}>
                  (First Name(*), Middle Name, Last Name(*), Mobile(*), Email(*), Gender(*), Blood Group(A+,B+,O+,AB+,A-,B-,O-,AB-), Age, DOB(*)(YYYY-MM-DD), Employee Status(*)(Active/Inactive/Suspended), Emergency Contact No 1, Emergency Contact Name 1, Emergency Contact No 2, Emergency Contact Name 2, Emergency Contact No 3, Emergency Contact Name 3, Emergency Contact No 4, Emergency Contact Name 4)
                </span>
              </p>
              <p className="mb-2">3. You must follow the csv file, otherwise your data will not be saved.</p>
              <p className="mb-0">4. (*) indicate mandatory fields in csv file.</p>
            </div>
          </div>
        </div>

        {/* Upload Form Card */}
        <div className="card" style={{ borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: 'none' }}>
          <div className="card-body" style={{ padding: '30px' }}>
            
            {uploadResult && (
              <div 
                className={`alert ${uploadResult.type === 'success' ? 'alert-success' : (uploadResult.type === 'warning' ? 'alert-warning' : 'alert-danger')}`} 
                style={{ 
                  borderRadius: '10px', 
                  padding: '20px', 
                  marginBottom: '25px', 
                  border: 'none', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                  backgroundColor: uploadResult.type === 'success' ? '#e8f8f5' : (uploadResult.type === 'warning' ? '#fcf3cf' : '#fdedec'),
                  color: uploadResult.type === 'success' ? '#1e8449' : (uploadResult.type === 'warning' ? '#b9770e' : '#c0392b')
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 style={{ margin: 0, fontWeight: 'bold' }}>
                    {uploadResult.type === 'success' && '🎉 Upload Successful!'}
                    {uploadResult.type === 'warning' && '⚠️ Partial Upload Success'}
                    {uploadResult.type === 'error' && '❌ Upload Failed'}
                  </h5>
                  <button type="button" onClick={() => setUploadResult(null)} style={{ border: 'none', background: 'transparent', fontSize: '24px', cursor: 'pointer', color: 'inherit' }}>
                    &times;
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: '15px' }}>{uploadResult.message}</p>
                
                {uploadResult.total !== undefined && (
                  <div className="mt-3" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    <span style={{ padding: '8px 15px', fontSize: '14px', borderRadius: '8px', backgroundColor: '#3498db', color: 'white', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      Total: {uploadResult.total}
                    </span>
                    <span style={{ padding: '8px 15px', fontSize: '14px', borderRadius: '8px', backgroundColor: '#2ecc71', color: 'white', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      Inserted: {uploadResult.inserted}
                    </span>
                    <span style={{ padding: '8px 15px', fontSize: '14px', borderRadius: '8px', backgroundColor: '#e74c3c', color: 'white', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                      Failed: {uploadResult.failed}
                    </span>
                  </div>
                )}
                
                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="mt-3 p-3 bg-white" style={{ borderRadius: '8px', maxHeight: '200px', overflowY: 'auto', border: `1px solid ${uploadResult.type === 'warning' ? '#fad7a1' : '#f5b7b1'}` }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: uploadResult.type === 'warning' ? '#b9770e' : '#c0392b' }}>Error Details:</p>
                    <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px', fontSize: '14px', color: uploadResult.type === 'warning' ? '#b9770e' : '#c0392b' }}>
                      {uploadResult.errors.map((err, index) => (
                        <li key={index} style={{ marginBottom: '5px' }}>
                          {typeof err === 'object' && err !== null ? (
                            <><strong>Row {err.row || '?'}:</strong> {err.message || JSON.stringify(err)}</>
                          ) : (
                            <>{err}</>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleUpload}>

              {/* <div className="row mb-4">
                <div className="col-md-3 mb-3 mb-md-0">
                  <label style={{ fontWeight: '600', color: '#2c3e50' }}>Select Tenant:</label>
                  <select 
                    name="tenant"
                    value={formData.tenant}
                    onChange={handleInputChange}
                    className="form-control"
                    style={{ borderRadius: '8px', border: '1px solid #ced4da', padding: '10px' }}
                  >
                    <option value="">Select Tenant</option>
                    <option value="tenant1">Tenant 1</option>
                    <option value="tenant2">Tenant 2</option>
                  </select>
                </div>

                <div className="col-md-3 mb-3 mb-md-0">
                  <label style={{ fontWeight: '600', color: '#2c3e50' }}>Start date:</label>
                  <input 
                    type="date" 
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="form-control"
                    style={{ borderRadius: '8px', border: '1px solid #ced4da', padding: '10px' }}
                  />
                </div>

                <div className="col-md-3 mb-3 mb-md-0">
                  <label style={{ fontWeight: '600', color: '#2c3e50' }}>Days:</label>
                  <input 
                    type="number" 
                    name="days"
                    value={formData.days}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Enter days"
                    style={{ borderRadius: '8px', border: '1px solid #ced4da', padding: '10px' }}
                  />
                </div>

                <div className="col-md-3">
                  <label style={{ fontWeight: '600', color: '#2c3e50' }}>Select Plan:</label>
                  <select 
                    name="plan"
                    value={formData.plan}
                    onChange={handleInputChange}
                    className="form-control"
                    style={{ borderRadius: '8px', border: '1px solid #ced4da', padding: '10px' }}
                  >
                    <option value="">Select Plan</option>
                    <option value="basic">Basic Plan</option>
                    <option value="premium">Premium Plan</option>
                  </select>
                </div>
              </div> */}

              <hr style={{ borderColor: '#ecf0f1', margin: '30px 0' }} />

              <div className="d-flex flex-column flex-md-row align-items-md-center gap-3">
                <div style={{ flex: 1, maxWidth: '400px', marginRight: '15px' }}>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="form-control-file"
                    style={{
                      padding: '10px',
                      border: '1px dashed #bdc3c7',
                      borderRadius: '8px',
                      backgroundColor: '#f8f9fa',
                      width: '100%'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-3 mt-md-0"
                  style={{
                    padding: '10px 30px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: isLoading ? '#6c757d' : '#0056b3',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    transition: 'background 0.3s'
                  }}
                  onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#004494')}
                  onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#0056b3')}
                >
                  {isLoading ? 'Uploading...' : 'Upload'}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserBulkUpload;

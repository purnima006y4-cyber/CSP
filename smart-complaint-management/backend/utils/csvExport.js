/**
 * Converts complaints array to CSV format with UTF-8 BOM
 *
 * @param {Array} complaints
 * @returns {string}
 */
function complaintsToCSV(complaints) {
  const headers = [
    'Complaint ID',
    'Resident Name',
    'Mobile',
    'Ward',
    'Category',
    'Priority',
    'Status',
    'Title',
    'Location',
    'Assigned Staff',
    'Complaint Date',
    'Resolved Date'
  ];

  const escapeField = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = complaints.map((c) => {
    const residentName = c.user ? c.user.fullName : 'N/A';
    const residentMobile = c.user ? c.user.mobile : 'N/A';
    const ward = c.user ? c.user.wardNumber : 'Ward 1';
    const cDate = c.complaintDate ? new Date(c.complaintDate).toLocaleString() : '';
    const rDate = c.resolvedDate ? new Date(c.resolvedDate).toLocaleString() : 'N/A';

    return [
      escapeField(c.complaintId),
      escapeField(residentName),
      escapeField(residentMobile),
      escapeField(ward),
      escapeField(c.category),
      escapeField(c.priority),
      escapeField(c.status),
      escapeField(c.title),
      escapeField(c.location),
      escapeField(c.assignedTo || 'Unassigned'),
      escapeField(cDate),
      escapeField(rDate)
    ].join(',');
  });

  // UTF-8 BOM + Header + Rows
  return '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
}

module.exports = complaintsToCSV;

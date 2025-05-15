import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Table,
  Tag,
  Button,
  Modal,
  Typography,
  Space,
  Tooltip,
  DatePicker,
  Select,
  Dropdown,
  Menu,
  Input,
  Badge,
  Card,
  Statistic,
  Row,
  Col,
  Spin
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  SettingOutlined,
  CalendarOutlined,
  UserOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import moment from "moment";
import Swal from "sweetalert2";
import Sidebar from "../../components/sidebar/user_sidebar";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Search } = Input;

function Approveleave() {
  const [approveleaves, setApproveleaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersMap, setUsersMap] = useState({});
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [searchText, setSearchText] = useState("");
  const [leaveSummary, setLeaveSummary] = useState(null);

  const handleApiError = useCallback((error, message) => {
    console.error(message, error);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: message,
      footer: "Please try again later",
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Use Promise.all to fetch leaves, users, and statistics in parallel
      const [leavesRes, usersRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/leaves/getallleaves"),
        axios.get("http://localhost:5000/api/users/getallusers"),
        axios.get("http://localhost:5000/api/leaves/statuscounts")
      ]);

      // Process leave data
      const leavesData = leavesRes.data;
      setApproveleaves(leavesData);
      setFilteredLeaves(leavesData);
      
      // Process users data - create ID to name mapping
      const userMapData = {};
      usersRes.data.forEach(user => {
        userMapData[user._id] = user.fullName || user.name || "Unknown Employee";
      });
      setUsersMap(userMapData);
      
      // Process statistics
      setLeaveSummary(statsRes.data);
      
      console.log("Users mapping created:", userMapData);
    } catch (error) {
      handleApiError(error, "Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  }, [handleApiError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const applyFilters = useCallback(() => {
    let filtered = approveleaves;

    if (filterStatus) {
      filtered = filtered.filter((leave) => leave.status === filterStatus);
    }

    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((leave) => {
        const leaveDate = moment(leave.fromdate, "DD-MM-YYYY");
        return leaveDate.isBetween(dateRange[0], dateRange[1], "day", "[]");
      });
    }

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter((leave) => {
        const employeeName = usersMap[leave.userid] || "";
        return (
          employeeName.toLowerCase().includes(searchLower) ||
          (leave.description || "").toLowerCase().includes(searchLower)
        );
      });
    }

    setFilteredLeaves(filtered);
  }, [approveleaves, filterStatus, dateRange, searchText, usersMap]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters, usersMap]);

  const getStatusColor = (status) => {
    const colorMap = {
      Pending: "orange",
      Approved: "green",
      Dissapproved: "red" // Note: using the same spelling as in your backend
    };
    return colorMap[status] || "default";
  };

  const updateLeaveStatus = useCallback(async (requestId, endpoint, newStatus) => {
    try {
      setLoading(true);
      await axios.post(endpoint, { requestid: requestId });

      const updatedLeaves = approveleaves.map((leave) =>
        leave._id === requestId
          ? {
              ...leave,
              status: newStatus
            }
          : leave
      );

      setApproveleaves(updatedLeaves);
      applyFilters();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Leave request ${newStatus.toLowerCase()} successfully`,
        showConfirmButton: false,
        timer: 1500,
      });
      
      // Refresh data after status update
      fetchData();
    } catch (error) {
      handleApiError(error, "Failed to update leave status");
    } finally {
      setLoading(false);
    }
  }, [approveleaves, fetchData, handleApiError, applyFilters]);

  const approve = (requestId) =>
    updateLeaveStatus(
      requestId,
      "http://localhost:5000/api/leaves/approverequest",
      "Approved"
    );

  const disapprove = (requestId) =>
    updateLeaveStatus(
      requestId,
      "http://localhost:5000/api/leaves/cancelrequest",
      "Dissapproved" // Note: using the same spelling as in your backend
    );

  const handleLeaveDetails = (record) => {
    setSelectedLeave(record);
  };

  const confirmLeaveAction = (record, action) => {
    const employeeName = usersMap[record.userid] || "Employee";
    
    Swal.fire({
      title: `Are you sure you want to ${action} this leave request?`,
      html: `
        <div class="text-left">
          <p><strong>Employee:</strong> ${employeeName}</p>
          <p><strong>Dates:</strong> ${record.fromdate} to ${record.todate}</p>
          <p><strong>Reason:</strong> ${record.description}</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: action === "approve" ? "#3085d6" : "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: action === "approve" ? "Yes, Approve" : "Yes, Reject",
    }).then((result) => {
      if (result.isConfirmed) {
        action === "approve" ? approve(record._id) : disapprove(record._id);
      }
    });
  };

  const getActionMenu = (record) => (
    <Menu>
      <Menu.Item
        key="view"
        icon={<EyeOutlined />}
        onClick={() => handleLeaveDetails(record)}
      >
        View Details
      </Menu.Item>
      {record.status === "Pending" && (
        <>
          <Menu.Item
            key="approve"
            icon={<CheckCircleOutlined />}
            onClick={() => confirmLeaveAction(record, "approve")}
          >
            Approve Leave
          </Menu.Item>
          <Menu.Item
            key="reject"
            icon={<CloseCircleOutlined />}
            danger
            onClick={() => confirmLeaveAction(record, "reject")}
          >
            Reject Leave
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  const columns = [
    {
      title: "Employee Name",
      dataIndex: "userid",
      key: "userid",
      render: (userid) => {
        const name = usersMap[userid] || "Loading...";
        return (
          <div className="flex items-center">
            <UserOutlined className="mr-2" />
            {name}
          </div>
        );
      },
      sorter: (a, b) => {
        const nameA = usersMap[a.userid] || "";
        const nameB = usersMap[b.userid] || "";
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "From Date",
      dataIndex: "fromdate",
      key: "fromdate",
      render: (date) => (
        <span>
          <CalendarOutlined className="mr-2" />
          {date}
        </span>
      ),
      sorter: (a, b) => moment(a.fromdate, "DD-MM-YYYY").unix() - moment(b.fromdate, "DD-MM-YYYY").unix(),
    },
    {
      title: "To Date",
      dataIndex: "todate",
      key: "todate",
      render: (date) => (
        <span>
          <CalendarOutlined className="mr-2" />
          {date}
        </span>
      ),
      sorter: (a, b) => moment(a.todate, "DD-MM-YYYY").unix() - moment(b.todate, "DD-MM-YYYY").unix(),
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, record) => {
        const fromDate = moment(record.fromdate, "DD-MM-YYYY");
        const toDate = moment(record.todate, "DD-MM-YYYY");
        const days = toDate.diff(fromDate, "days") + 1;
        return `${days} day${days !== 1 ? 's' : ''}`;
      },
      sorter: (a, b) => {
        const daysA = moment(a.todate, "DD-MM-YYYY").diff(moment(a.fromdate, "DD-MM-YYYY"), "days") + 1;
        const daysB = moment(b.todate, "DD-MM-YYYY").diff(moment(b.fromdate, "DD-MM-YYYY"), "days") + 1;
        return daysA - daysB;
      },
    },
    {
      title: "Reason",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <div className="flex items-start">
          <FileTextOutlined className="mr-2 mt-1" />
          <Tooltip title={text}>
            <span className="truncate max-w-xs block">{text}</span>
          </Tooltip>
        </div>
      ),
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Approved", value: "Approved" },
        { text: "Rejected", value: "Dissapproved" }, // Note: using the same spelling as in your backend
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Dropdown
          overlay={getActionMenu(record)}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<SettingOutlined />}
            className="hover:bg-gray-100 rounded-full"
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 h-full">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 overflow-y-auto flex-1">
          <Title level={3}>Leave Management</Title>
          
          {leaveSummary && (
            <Row gutter={16} className="mb-6">
              <Col span={8}>
                <Card>
                  <Statistic 
                    title="Pending Requests" 
                    value={leaveSummary.pending.count} 
                    suffix={`(${leaveSummary.pending.percentage}%)`}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic 
                    title="Approved Requests" 
                    value={leaveSummary.approved.count} 
                    suffix={`(${leaveSummary.approved.percentage}%)`} 
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic 
                    title="Rejected Requests" 
                    value={leaveSummary.disapproved.count} 
                    suffix={`(${leaveSummary.disapproved.percentage}%)`} 
                    valueStyle={{ color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
            </Row>
          )}
          
          {/* Filters */}
          <Card className="mb-6">
            <Space className="w-full flex-wrap" size="middle">
              <Search
                placeholder="Search by employee or reason"
                allowClear
                style={{ width: 250 }}
                onSearch={(value) => setSearchText(value)}
                onChange={(e) => setSearchText(e.target.value)}
              />

              <Select
                placeholder="Filter by Status"
                style={{ width: 150 }}
                allowClear
                onChange={(value) => setFilterStatus(value)}
              >
                <Select.Option value="Pending">Pending</Select.Option>
                <Select.Option value="Approved">Approved</Select.Option>
                <Select.Option value="Dissapproved">Rejected</Select.Option>
              </Select>

              <RangePicker 
                onChange={(dates) => setDateRange(dates)} 
                format="DD-MM-YYYY"
              />
              
              <Button 
                type="primary" 
                onClick={fetchData}
              >
                Refresh
              </Button>
            </Space>
          </Card>

          {/* Table */}
          <Card>
            <Table
              columns={columns}
              dataSource={filteredLeaves}
              loading={loading}
              rowKey="_id"
              pagination={{
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50"],
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} leave requests`,
              }}
            />
          </Card>
        </div>
      </div>

      {/* Leave Details Modal */}
      {selectedLeave && (
        <Modal
          title="Leave Request Details"
          open={!!selectedLeave}
          onCancel={() => setSelectedLeave(null)}
          footer={[
            <Button key="close" onClick={() => setSelectedLeave(null)}>
              Close
            </Button>,
            selectedLeave.status === "Pending" && (
              <>
                <Button 
                  key="approve" 
                  type="primary"
                  onClick={() => {
                    approve(selectedLeave._id);
                    setSelectedLeave(null);
                  }}
                >
                  Approve
                </Button>
                <Button 
                  key="reject" 
                  danger
                  onClick={() => {
                    disapprove(selectedLeave._id);
                    setSelectedLeave(null);
                  }}
                >
                  Reject
                </Button>
              </>
            )
          ].filter(Boolean)}
        >
          <div className="space-y-3">
            <div>
              <strong>Employee:</strong> {usersMap[selectedLeave.userid] || "Unknown Employee"}
            </div>
            <div>
              <strong>From Date:</strong> {selectedLeave.fromdate}
            </div>
            <div>
              <strong>To Date:</strong> {selectedLeave.todate}
            </div>
            <div>
              <strong>Duration:</strong> {moment(selectedLeave.todate, "DD-MM-YYYY").diff(moment(selectedLeave.fromdate, "DD-MM-YYYY"), "days") + 1} days
            </div>
            <div>
              <strong>Reason:</strong> {selectedLeave.description}
            </div>
            <div>
              <strong>Status:</strong> <Tag color={getStatusColor(selectedLeave.status)}>{selectedLeave.status}</Tag>
            </div>
            <div>
              <strong>Submitted:</strong> {moment(selectedLeave.createdAt).format("DD MMM YYYY, h:mm A")}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Approveleave;
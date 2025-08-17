import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FaBlog } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

function HomeOverview() {
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [topicData, setTopicData] = useState({});

  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL;

  const fetchDashboardData = async () => {
    try {
      const totalRes = await axios.get(
        `${API_URL}/api/posts/dashboard/total-blogs`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTotalBlogs(totalRes.data.totalBlogs);

      const latestRes = await axios.get(
        `${API_URL}/api/posts/dashboard/latest-blogs`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLatestBlogs(latestRes.data);

      const topicsRes = await axios.get(
        `${API_URL}/api/posts/dashboard/topics-graph`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const allCategories = ["Startup", "Tech", "Health", "Education"];
      const topicCounts = {};
      allCategories.forEach((cat) => (topicCounts[cat] = 0));
      topicsRes.data.forEach((item) => (topicCounts[item._id] = item.count));
      setTopicData(topicCounts);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-indigo-600 text-center sm:text-left mb-6">
        Dashboard Overview
      </h2>

      {/* ---------------- Cards & Chart Grid ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Blogs Card */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-2xl rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4 transform transition hover:scale-105 duration-300 h-60 md:h-64 lg:h-72">
          <FaBlog className="text-5xl md:text-6xl" />
          <div className="text-center sm:text-left">
            <p className="text-gray-200 font-medium">Total Blogs Published</p>
            <p className="text-3xl md:text-4xl font-bold">{totalBlogs}</p>
          </div>
        </div>

        {/* Topics Doughnut Chart */}
        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 w-full h-64 sm:h-72 md:h-80 lg:h-96 hover:scale-105 transform transition duration-300 flex flex-col">
          <h3 className="font-bold mb-4 text-xl md:text-2xl text-center text-indigo-600">
            Blogs by Topic
          </h3>
          <div className="flex-1 flex justify-center items-center">
            <Doughnut
              data={{
                labels: Object.keys(topicData),
                datasets: [
                  {
                    data: Object.values(topicData),
                    backgroundColor: [
                      "#FF6384",
                      "#36A2EB",
                      "#FFCE56",
                      "#4BC0C0",
                      "#9966FF",
                      "#FF9F40",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "bottom", labels: { boxWidth: 20, padding: 15 } },
                  tooltip: { enabled: true },
                },
                animation: { animateScale: true },
              }}
            />
          </div>
        </div>
      </div>

      {/* ---------------- Latest Blogs Table ---------------- */}
      <div className="bg-white shadow-2xl rounded-2xl p-4 sm:p-6 overflow-x-auto">
        <h3 className="font-bold mb-4 sm:mb-6 text-2xl text-center sm:text-left text-indigo-600">
          Latest Blogs
        </h3>
        <div className="min-w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-indigo-600 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-indigo-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-indigo-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-indigo-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {latestBlogs.map((blog, index) => (
                <tr
                  key={blog._id}
                  className={index % 2 === 0 ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-100"}
                >
                  <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-gray-900 font-medium">
                    {blog.title}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-gray-700">
                    {blog.category || "All"}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-gray-700">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 sm:px-6 py-2 sm:py-3 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        blog.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {latestBlogs.length === 0 && (
          <p className="text-gray-500 mt-4 text-center">No blogs available.</p>
        )}
      </div>
    </div>
  );
}

export default HomeOverview;

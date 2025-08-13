"use client";
import {
   User,
   Calendar,
   BarChart2,
   Award,
   ArrowRight,
   ArrowUp,
   ArrowDown,
   BookOpen,
   Download,
   Filter,
   ChevronDown,
   Info,
} from "lucide-react";
import { useState } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useProfile } from "@/hooks/useAuth";
import {
   LineChart,
   Line,
   BarChart,
   Bar,
   PieChart,
   Pie,
   Cell,
   RadarChart,
   PolarGrid,
   PolarAngleAxis,
   PolarRadiusAxis,
   Radar,
   ResponsiveContainer,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
} from "recharts";

const PerformancePage = () => {
   const { data: user, isLoading, isError } = useProfile();
   const [selectedChild, setSelectedChild] = useState(0);
   const [selectedTimeframe, setSelectedTimeframe] = useState("term");
   const [selectedSubject, setSelectedSubject] = useState("all");

   // Sample data - would come from API in production
   const children = [
      {
         id: 1,
         name: "Emma Johnson",
         grade: "Grade 5",
         avatar: null,
      },
      {
         id: 2,
         name: "Noah Johnson",
         grade: "Grade 3",
         avatar: null,
      },
   ];

   const subjects = [
      { id: "all", name: "All Subjects" },
      { id: "math", name: "Mathematics" },
      { id: "science", name: "Science" },
      { id: "english", name: "English" },
      { id: "history", name: "History" },
   ];

   const timeframes = [
      { id: "term", name: "Current Term" },
      { id: "year", name: "Academic Year" },
      { id: "quarter", name: "Last Quarter" },
      { id: "month", name: "Last Month" },
   ];

   const selectedChildData = children[selectedChild];

   // Performance overview data
   const performanceOverview = {
      average: 85,
      change: 3.2,
      gradeLevel: "Above Average",
      classRank: 5,
      totalStudents: 28,
      testsTaken: 12,
      improvementAreas: ["Writing Essays", "Fractions", "Chemical Reactions"],
      strengthAreas: [
         "Reading Comprehension",
         "Geometry",
         "Historical Analysis",
      ],
   };

   // Subject performance data
   const subjectPerformance = [
      {
         subject: "Mathematics",
         average: 88,
         change: 4.5,
         lastGrade: "A-",
         assessments: 4,
      },
      {
         subject: "Science",
         average: 82,
         change: -1.8,
         lastGrade: "B+",
         assessments: 3,
      },
      {
         subject: "English",
         average: 91,
         change: 2.1,
         lastGrade: "A",
         assessments: 5,
      },
      {
         subject: "History",
         average: 79,
         change: 5.6,
         lastGrade: "B",
         assessments: 3,
      },
      {
         subject: "Art",
         average: 95,
         change: 0,
         lastGrade: "A",
         assessments: 2,
      },
   ];

   // Data for subject performance chart
   const subjectChartData = subjectPerformance.map((subject) => ({
      name: subject.subject,
      Score: subject.average,
      ClassAverage: subject.average - Math.floor(Math.random() * 10),
   }));

   // Recent assessments data
   const recentAssessments = [
      {
         title: "Math Mid-Term Exam",
         date: "Feb 15, 2025",
         score: 86,
         maxScore: 100,
         subject: "Mathematics",
      },
      {
         title: "Book Report: Charlotte's Web",
         date: "Feb 10, 2025",
         score: 92,
         maxScore: 100,
         subject: "English",
      },
      {
         title: "Science Lab: Photosynthesis",
         date: "Feb 8, 2025",
         score: 78,
         maxScore: 100,
         subject: "Science",
      },
      {
         title: "History Quiz: Ancient Egypt",
         date: "Feb 3, 2025",
         score: 84,
         maxScore: 100,
         subject: "History",
      },
   ];

   // Performance over time data for line chart
   const performanceOverTime = [
      { name: "Sep", Score: 78, ClassAverage: 75 },
      { name: "Oct", Score: 76, ClassAverage: 74 },
      { name: "Nov", Score: 82, ClassAverage: 75 },
      { name: "Dec", Score: 80, ClassAverage: 76 },
      { name: "Jan", Score: 84, ClassAverage: 78 },
      { name: "Feb", Score: 85, ClassAverage: 79 },
   ];

   // Skill radar data
   const skillRadarData = [
      { subject: "Critical Thinking", A: 8, fullMark: 10 },
      { subject: "Problem Solving", A: 7, fullMark: 10 },
      { subject: "Creativity", A: 9, fullMark: 10 },
      { subject: "Collaboration", A: 6, fullMark: 10 },
      { subject: "Communication", A: 8, fullMark: 10 },
      { subject: "Research", A: 7, fullMark: 10 },
   ];

   // Time spent by subject (pie chart)
   const timeSpentData = [
      { name: "Math", value: 35 },
      { name: "Science", value: 25 },
      { name: "English", value: 20 },
      { name: "History", value: 15 },
      { name: "Other", value: 5 },
   ];

   const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

   // Chart customization
   const mainColor = "#3b82f6"; // Assuming this is your "main" color
   const secondaryColor = "#d1d5db";

   if (isLoading) {
      return <div>Loading...</div>;
   }

   return (
      <>
         <div className="w-full space-y-6">
            <DashboardNavbar title="Performance" />

            {/* Child Selector */}
            <div className="bg-white rounded-lg shadow p-4">
               <div className="flex flex-wrap gap-3">
                  {children.map((child, index) => (
                     <button
                        key={child.id}
                        onClick={() => setSelectedChild(index)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                           selectedChild === index
                              ? "bg-main text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                        }`}
                     >
                        <User size={16} />
                        {child.name}
                     </button>
                  ))}
               </div>
            </div>

            {/* Filter Controls */}
            <div className="bg-white rounded-lg shadow p-4">
               <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Filter
                        size={16}
                        className="text-gray-500"
                     />
                     <span className="text-gray-700 font-medium">
                        Filter by:
                     </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                     <div className="relative">
                        <select
                           value={selectedTimeframe}
                           onChange={(e) =>
                              setSelectedTimeframe(e.target.value)
                           }
                           className="appearance-none bg-gray-100 text-gray-700 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-main/50"
                        >
                           {timeframes.map((timeframe) => (
                              <option
                                 key={timeframe.id}
                                 value={timeframe.id}
                              >
                                 {timeframe.name}
                              </option>
                           ))}
                        </select>
                        <ChevronDown
                           size={16}
                           className="text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                        />
                     </div>

                     <div className="relative">
                        <select
                           value={selectedSubject}
                           onChange={(e) => setSelectedSubject(e.target.value)}
                           className="appearance-none bg-gray-100 text-gray-700 py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-main/50"
                        >
                           {subjects.map((subject) => (
                              <option
                                 key={subject.id}
                                 value={subject.id}
                              >
                                 {subject.name}
                              </option>
                           ))}
                        </select>
                        <ChevronDown
                           size={16}
                           className="text-gray-500 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
                        />
                     </div>
                  </div>

                  <button className="bg-main hover:bg-main/90 transition-colors text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                     <Download size={16} />
                     Download Report
                  </button>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Main Performance Overview */}
               <div className="md:col-span-2 space-y-6">
                  {/* Performance Summary */}
                  <div className="bg-white rounded-lg shadow p-6">
                     <div className="flex justify-between items-start mb-6">
                        <h3 className="text-lg font-semibold">
                           Performance Overview
                        </h3>
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                           <Calendar
                              size={14}
                              className="text-gray-500"
                           />
                           <span>
                              {
                                 timeframes.find(
                                    (t) => t.id === selectedTimeframe
                                 )?.name
                              }
                           </span>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                           <p className="text-gray-600 text-sm mb-1">
                              Average Score
                           </p>
                           <p className="text-3xl font-bold text-main">
                              {performanceOverview.average}%
                           </p>
                           <div
                              className={`flex items-center justify-center text-sm mt-1 ${
                                 performanceOverview.change >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                              }`}
                           >
                              {performanceOverview.change >= 0 ? (
                                 <ArrowUp size={14} />
                              ) : (
                                 <ArrowDown size={14} />
                              )}
                              <span>
                                 {Math.abs(performanceOverview.change)}%
                              </span>
                           </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                           <p className="text-gray-600 text-sm mb-1">
                              Grade Level
                           </p>
                           <p className="text-xl font-bold text-main">
                              {performanceOverview.gradeLevel}
                           </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                           <p className="text-gray-600 text-sm mb-1">
                              Class Rank
                           </p>
                           <p className="text-xl font-bold text-main">
                              {performanceOverview.classRank}/
                              {performanceOverview.totalStudents}
                           </p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                           <p className="text-gray-600 text-sm mb-1">
                              Tests Taken
                           </p>
                           <p className="text-xl font-bold text-main">
                              {performanceOverview.testsTaken}
                           </p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                           <h4 className="text-md font-medium mb-3 flex items-center">
                              <Award
                                 size={18}
                                 className="text-main mr-2"
                              />
                              Strength Areas
                           </h4>
                           <ul className="space-y-2">
                              {performanceOverview.strengthAreas.map(
                                 (area, index) => (
                                    <li
                                       key={index}
                                       className="flex items-center gap-2"
                                    >
                                       <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                       <span>{area}</span>
                                    </li>
                                 )
                              )}
                           </ul>
                        </div>

                        <div>
                           <h4 className="text-md font-medium mb-3 flex items-center">
                              <BarChart2
                                 size={18}
                                 className="text-main mr-2"
                              />
                              Areas for Improvement
                           </h4>
                           <ul className="space-y-2">
                              {performanceOverview.improvementAreas.map(
                                 (area, index) => (
                                    <li
                                       key={index}
                                       className="flex items-center gap-2"
                                    >
                                       <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                       <span>{area}</span>
                                    </li>
                                 )
                              )}
                           </ul>
                        </div>
                     </div>
                  </div>

                  {/* Performance Chart */}
                  <div className="bg-white rounded-lg shadow p-6">
                     <h3 className="text-lg font-semibold mb-4">
                        Performance Over Time
                     </h3>
                     <div className="h-72">
                        <ResponsiveContainer
                           width="100%"
                           height="100%"
                        >
                           <LineChart
                              data={performanceOverTime}
                              margin={{
                                 top: 10,
                                 right: 30,
                                 left: 0,
                                 bottom: 10,
                              }}
                           >
                              <CartesianGrid
                                 strokeDasharray="3 3"
                                 stroke="#f3f4f6"
                              />
                              <XAxis
                                 dataKey="name"
                                 stroke="#9ca3af"
                              />
                              <YAxis
                                 stroke="#9ca3af"
                                 domain={[60, 100]}
                              />
                              <Tooltip
                                 contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                 }}
                              />
                              <Legend />
                              <Line
                                 type="monotone"
                                 dataKey="Score"
                                 stroke={mainColor}
                                 strokeWidth={3}
                                 dot={{ r: 6, strokeWidth: 2 }}
                                 activeDot={{ r: 8 }}
                              />
                              <Line
                                 type="monotone"
                                 dataKey="ClassAverage"
                                 stroke="#94a3b8"
                                 strokeDasharray="5 5"
                                 dot={{ r: 4 }}
                              />
                           </LineChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  {/* Subject Performance Chart */}
                  <div className="bg-white rounded-lg shadow p-6">
                     <h3 className="text-lg font-semibold mb-4">
                        Subject Performance
                     </h3>
                     <div className="h-72">
                        <ResponsiveContainer
                           width="100%"
                           height="100%"
                        >
                           <BarChart
                              data={subjectChartData}
                              margin={{
                                 top: 10,
                                 right: 30,
                                 left: 0,
                                 bottom: 10,
                              }}
                           >
                              <CartesianGrid
                                 strokeDasharray="3 3"
                                 stroke="#f3f4f6"
                              />
                              <XAxis
                                 dataKey="name"
                                 stroke="#9ca3af"
                              />
                              <YAxis
                                 stroke="#9ca3af"
                                 domain={[0, 100]}
                              />
                              <Tooltip
                                 contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                 }}
                              />
                              <Legend />
                              <Bar
                                 dataKey="Score"
                                 fill={mainColor}
                                 radius={[4, 4, 0, 0]}
                              />
                              <Bar
                                 dataKey="ClassAverage"
                                 fill="#94a3b8"
                                 radius={[4, 4, 0, 0]}
                              />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  {/* Subject Performance Table */}
                  <div className="bg-white rounded-lg shadow p-6">
                     <h3 className="text-lg font-semibold mb-4">
                        Detailed Subject Data
                     </h3>
                     <div className="overflow-x-auto">
                        <table className="min-w-full">
                           <thead>
                              <tr className="border-b">
                                 <th className="text-left py-3 px-4">
                                    Subject
                                 </th>
                                 <th className="text-center py-3 px-4">
                                    Average
                                 </th>
                                 <th className="text-center py-3 px-4">
                                    Change
                                 </th>
                                 <th className="text-center py-3 px-4">
                                    Last Grade
                                 </th>
                                 <th className="text-center py-3 px-4">
                                    Assessments
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                              {subjectPerformance.map((subject, index) => (
                                 <tr
                                    key={index}
                                    className="border-b last:border-b-0 hover:bg-gray-50"
                                 >
                                    <td className="py-3 px-4 font-medium">
                                       {subject.subject}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                       {subject.average}%
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                       <span
                                          className={`flex items-center justify-center ${
                                             subject.change >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                          }`}
                                       >
                                          {subject.change >= 0 ? (
                                             <ArrowUp
                                                size={14}
                                                className="mr-1"
                                             />
                                          ) : (
                                             <ArrowDown
                                                size={14}
                                                className="mr-1"
                                             />
                                          )}
                                          {Math.abs(subject.change)}%
                                       </span>
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                       {subject.lastGrade}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                       {subject.assessments}
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>

               {/* Sidebar */}
               <div className="space-y-6">
                  {/* Recent Assessments */}
                  <div className="bg-white rounded-lg shadow p-6">
                     <h3 className="text-lg font-semibold mb-4">
                        Recent Assessments
                     </h3>
                     <div className="space-y-4">
                        {recentAssessments.map((assessment, i) => (
                           <div
                              key={i}
                              className="border-b pb-4 last:border-b-0"
                           >
                              <div className="flex justify-between items-start mb-1">
                                 <p className="font-medium">
                                    {assessment.title}
                                 </p>
                                 <span className="bg-main/10 text-main px-2 py-0.5 rounded-full text-xs font-medium">
                                    {assessment.score}/{assessment.maxScore}
                                 </span>
                              </div>
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                 <Calendar
                                    size={14}
                                    className="mr-1"
                                 />
                                 <span>{assessment.date}</span>
                                 <span className="mx-2">•</span>
                                 <span>{assessment.subject}</span>
                              </div>
                              <div className="relative pt-1">
                                 <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                       className={`h-2 rounded-full ${
                                          assessment.score >= 90
                                             ? "bg-green-500"
                                             : assessment.score >= 80
                                             ? "bg-main"
                                             : assessment.score >= 70
                                             ? "bg-yellow-500"
                                             : "bg-red-500"
                                       }`}
                                       style={{
                                          width: `${
                                             (assessment.score /
                                                assessment.maxScore) *
                                             100
                                          }%`,
                                       }}
                                    ></div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                     <button className="w-full mt-4 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2">
                        <BookOpen size={14} />
                        View All Assessments
                     </button>
                  </div>

                  {/* Skills Radar Chart */}
                  <div className="bg-white rounded-lg shadow p-6">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                           Skills Assessment
                        </h3>
                        <button className="text-gray-500 hover:text-gray-700">
                           <Info size={16} />
                        </button>
                     </div>
                     <div className="h-64">
                        <ResponsiveContainer
                           width="100%"
                           height="100%"
                        >
                           <RadarChart
                              outerRadius="70%"
                              data={skillRadarData}
                           >
                              <PolarGrid stroke="#e5e7eb" />
                              <PolarAngleAxis
                                 dataKey="subject"
                                 tick={{ fill: "#6b7280", fontSize: 11 }}
                              />
                              <PolarRadiusAxis
                                 domain={[0, 10]}
                                 tick={{ fill: "#6b7280" }}
                              />
                              <Radar
                                 name="Skills"
                                 dataKey="A"
                                 stroke={mainColor}
                                 fill={mainColor}
                                 fillOpacity={0.5}
                              />
                              <Tooltip />
                           </RadarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  {/* Time Spent by Subject */}
                  <div className="bg-white rounded-lg shadow p-6">
                     <h3 className="text-lg font-semibold mb-4">
                        Time Spent by Subject
                     </h3>
                     <div className="h-64">
                        <ResponsiveContainer
                           width="100%"
                           height="100%"
                        >
                           <PieChart>
                              <Pie
                                 data={timeSpentData}
                                 cx="50%"
                                 cy="50%"
                                 labelLine={false}
                                 outerRadius={80}
                                 fill="#8884d8"
                                 dataKey="value"
                                 label={({ name, percent }) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
                                 }
                              >
                                 {timeSpentData.map((entry, index) => (
                                    <Cell
                                       key={`cell-${index}`}
                                       fill={COLORS[index % COLORS.length]}
                                    />
                                 ))}
                              </Pie>
                              <Tooltip
                                 formatter={(value, name) => [
                                    `${value}%`,
                                    name,
                                 ]}
                                 contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "8px",
                                 }}
                              />
                           </PieChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  {/* Teacher Comments */}
                  <div className="bg-white rounded-lg shadow p-6">
                     <h3 className="text-lg font-semibold mb-4">
                        Teacher Comments
                     </h3>
                     <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                           <p className="text-sm italic">
                           &quot; Emma is making excellent progress in most
                              subjects. Her critical thinking skills have
                              improved significantly this term. I recommend more
                              practice with mathematical word problems to
                              further strengthen her problem-solving abilities.&quot;
                           </p>
                           <div className="flex justify-between items-center mt-3 text-sm">
                              <p className="font-medium">Ms. Williams</p>
                              <p className="text-gray-500">Feb 20, 2025</p>
                           </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                           <p className="text-sm italic">
                              &quot;Emma shows great enthusiasm during science
                              experiments. She should focus on documenting her
                              observations more thoroughly in her lab reports.&quot;
                           </p>
                           <div className="flex justify-between items-center mt-3 text-sm">
                              <p className="font-medium">Mr. Johnson</p>
                              <p className="text-gray-500">Feb 12, 2025</p>
                           </div>
                        </div>
                     </div>
                     <button className="w-full mt-4 flex justify-between items-center text-main hover:underline px-2 py-1 text-sm">
                        <span>View all teacher comments</span>
                        <ArrowRight size={14} />
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default PerformancePage;

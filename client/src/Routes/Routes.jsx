import { createBrowserRouter } from "react-router";
import RootLayout from "../Layouts/RootLayout/RootLayout";
import Home from "../Home/Home/Home";
import Login from "../Authentication/Login/Login";
import Register from "../Authentication/Register/Register";
import AllTrainers from "../Pages/AllTrainers/AllTrainers";
import AllClasses from "../Pages/AllClasses/AllClasses";
import Community from "../Pages/Community/Community";
import TrainersDetails from "../Pages/TrainersDetails/TrainersDetails";
import DashboardLayout from "../Layouts/DashboardLayout/DashboardLayout";
import BeATrainer from "../Pages/BeATrainer/BeATrainer";
import AppliedTrainers from "../DashboardPages/AppliedTrainers/AppliedTrainers";
import TrainerBookingForm from "../Forms/TrainerBokingForm/TrainerBokingForm";
import MyBookings from "../DashboardPages/MyBookings/MyBookings";
import Profile from "../DashboardPages/Profile/Profile";
import AddClass from "../DashboardPages/AddClass/AddClass";
import Subscribers from "../DashboardPages/Subscribers/Subscribers";
import AllTrainersTable from "../DashboardPages/AllTrainersTable/AllTrainersTable";
import ManageSlots from "../DashboardPages/ManageSlots/ManageSlots";
import AddSlot from "../DashboardPages/AddSlot/AddSlot";
import ActivityLog from "../DashboardPages/ActivityLog/ActivityLog";
import Balance from "../DashboardPages/Balance/Balance";
import PrivateRoutes from "../Providers/PrivateRoutes";
import AddForum from "../DashboardPages/AddForum/AddForum";
import Error from "../Pages/Error/Error";
import About from "../Home/About/About";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { path: "/", Component: Home },
      { path: "/login", Component: Login },
      { path: "/register", Component: Register },
      { path: "/alltrainers", Component: AllTrainers },
      { path: "/allclasses", Component: AllClasses },
      { path: "/about", Component:About },
      {
        path: "/community",
        element: (
          <PrivateRoutes>
            <Community />
          </PrivateRoutes>
        ),
      },
      {
        path: "/trainers-details/:id",
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_BASE_URL}/trainers/${params.id}`),
        element: <PrivateRoutes>
          <TrainersDetails/>
        </PrivateRoutes>,
      },

      {
        path: "/trainer-booking-form/:id",
        loader: ({ params }) =>
          fetch(`${import.meta.env.VITE_BASE_URL}/trainers/${params.id}`),
        element:  <PrivateRoutes>
          <TrainerBookingForm/>
        </PrivateRoutes>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout />
      </PrivateRoutes>
    ),
    children: [
      {
        path: "applied-trainers",
        element: (
          <PrivateRoutes>
            <AppliedTrainers />
          </PrivateRoutes>
        ),
      },
      {
        path: "my-bookings",
        element: (
          <PrivateRoutes>
            <MyBookings />
          </PrivateRoutes>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoutes>
            <Profile />
          </PrivateRoutes>
        ),
      },
      {
        path: "addclass",
        element: (
          <PrivateRoutes>
            <AddClass />
          </PrivateRoutes>
        ),
      },
      {
        path: "addforum",
        element: (
          <PrivateRoutes>
            <AddForum />
          </PrivateRoutes>
        ),
      },
      {
        path: "subscribers",
        element: (
          <PrivateRoutes>
            <Subscribers />
          </PrivateRoutes>
        ),
      },
      {
        path: "all-trainers-table",
        element: (
          <PrivateRoutes>
            <AllTrainersTable />
          </PrivateRoutes>
        ),
      },
      {
        path: "balance",
        element: (
          <PrivateRoutes>
            <Balance />
          </PrivateRoutes>
        ),
      },
      {
        path: "manage-slots",
        element: (
          <PrivateRoutes>
            <ManageSlots />
          </PrivateRoutes>
        ),
      },
      {
        path: "add-slot",
        element: (
          <PrivateRoutes>
            <AddSlot />
          </PrivateRoutes>
        ),
      },
      {
        path: "activity-log",
        element: (
          <PrivateRoutes>
            <ActivityLog />
          </PrivateRoutes>
        ),
      },
      {
        path: "be-a-trainer",
        element: (
          <PrivateRoutes>
            <BeATrainer />
          </PrivateRoutes>
        ),
      },
    ],
  },
  {
    path: "*",
    Component: Error,
  },
]);

import './App.css';
import Layout from './components/layout/Layout';
import {  BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Catagory from './components/catagory/Catagory';
import CatagoryForm from './components/catagory/CatagoryForm';
import Banner from './components/bannner/Banner';
import BannerForm from './components/bannner/BannerForm';
import UserList from './components/users/UserList';
import Artist from './components/artists/Artist';
import UserProfile from './components/users/UserProfile';
import ArtistProfile from './components/artists/ArtistProfile';
import AddClip from './components/artists/AddClip'
import ChangeDesc from './components/artists/ChangeDesc';
import Description from './components/description/Description';
import Video from './components/videos/Video';
import VideoForm from './components/videos/VideoForm';
import VideoList from './components/videos/VideoList';
import Customers from './components/customers/Customer';
import CustomerList from './components/customers/CustomerList';
import Dashboard from './components/dashboard/Dashboard';
import Payment from './components/payment/Payment';
import PaymentDetails from './components/payment/PaymentDetails';
import UserForm from './components/customers/UserForm';
import Artistpayment from './components/payment/Artistpayment';
import ArtistPaymentDetails from './components/payment/ArtistPaymentDetails';
import NewArtist from './components/artists/NewArtist';
import Login from './components/login/Login';
import Signup from './components/login/Signup';
import PushNotifications from './components/description/PushNotification';
import Faq from './components/faq/Faq';
function App() {
  return (
   <>
  <Router>
  <Routes>
    {/* Login route without Layout */}
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/" element={<Layout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path= "/login" element={<Login/>} />
    <Route path= "/user-form/:uuid/:booking_id" element={<UserForm/>} />
    <Route path= "/new-artist" element={<NewArtist/>} />
    <Route path= "/artist-payments" element={<Artistpayment/>} />
    <Route path= "/payment" element={<Payment/>} />
    <Route path= "/artist-payment-details/:transactionId" element={<ArtistPaymentDetails/>} />
    <Route path= "/payment-details/:transactionId" element={<PaymentDetails/>} />
    <Route path= "/" element={<Dashboard/>} />
    <Route path= "/category" element={<Catagory/>} />
    <Route path="/add-category" element={<CatagoryForm/>} /> 
    <Route path="/add-category/:categoryId" element={<CatagoryForm/>} /> 
    <Route path="/banner" element={<Banner/>}/>
    <Route path="/add-banner" element={<BannerForm/>}/>
    <Route path="/add-banner/:bannerId" element={<BannerForm/>}/>
    <Route path="/bookings" element={<UserList/>}/>
    <Route path="/artists" element={<Artist />}/>
    <Route path='/videos' element={<Video />} />
    <Route path='/add-video' element={<VideoForm />} />
    <Route path='/add-video/:videoId' element={<VideoForm />} />
    <Route path='/videolist' element={<VideoList />} />
    <Route path="/user-profile/:booking_id" element={<UserProfile />} />
    <Route path="/artist-profile/:user_id" element={<ArtistProfile />} />
    <Route path="/add-clip/:user_id" element={<AddClip/>} />
    <Route path="/change-desc" element={<ChangeDesc />}/>
    <Route path="/des" element={<Description />}/>
    <Route path="/customer-profile/:user_id" element={<Customers />} />
    <Route path= '/users' element={<CustomerList />} /> 
    <Route path= '/push' element={<PushNotifications />} /> 
    <Route path= '/faq' element={<Faq />} /> 
</Route>
  </Routes>
  </Router>
   </>
  );
}

export default App;

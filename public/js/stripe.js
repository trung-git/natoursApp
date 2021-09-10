import axios from 'axios';
import { showAlert } from './alert';
// import Stripe from 'stripe';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51JVxqsGE0paLMBTwBSMGHbT9upUimYPgFFT80cf4GKfLdRkwpgeoZPuRv3MPfXiMo2bs0LGb5MQUNR20Nqd9p71z00eUCaFaAK'
    );
    const session = await axios(`/api/v1/booking/checkout-session/${tourId}`);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    console.log(error);
    showAlert('error', error);
  }
};

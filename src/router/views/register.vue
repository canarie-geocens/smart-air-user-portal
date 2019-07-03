<template>
  <layout>
    <main-content>
      <loading :active.sync="isLoading" :is-full-page="fullPage"></loading>
      <b-alert v-if="successAlert" variant="success" show>
        Thank you for registering your sensor! We will process the registration
        and put your sensor on the air map as soon as possible.</b-alert
      >
      <b-alert v-if="dangerAlert" variant="danger"
        >Sorry, Something Went Wrong. Please try again later.</b-alert
      >
      <div class="withSubNavbar">
        <nav class="navbar navbar-light bg-white">
          <a class="navbar-brand" href="#"> Register Your Sensors </a>
        </nav>
        <div class="main-content-padding">
          <div>
            <b-form
              v-if="show"
              @submit.prevent="validateBeforeSubmit"
              @reset="onReset"
            >
              <div class="jumbotron">
                <div class="container">
                  <b-form-group label="Device MAC (*)" label-for="deviceMAC">
                    <b-form-input
                      id="mac"
                      v-model="form.device"
                      v-validate="{ length: 6, alpha_num: true }"
                      name="mac"
                      type="text"
                      placeholder="Your Device MAC address"
                    />
                    <span
                      v-show="errors.has('mac')"
                      class="help invalid-feedback"
                      >The mac address should be 6 characters</span
                    >
                  </b-form-group>
                </div>
              </div>
              <div class="container">
                <b-row>
                  <b-col>
                    <b-form-group label="Your City:">
                      <b-form-input
                        id="city"
                        v-model="form.city"
                        name="city"
                        type="text"
                        placeholder="Your City"
                      />
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Your Adress:">
                      <b-form-input
                        id="address"
                        v-model="form.address"
                        name="address"
                        type="text"
                        placeholder="Your Address"
                      />
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group label="Your Postal Code (*)">
                      <b-form-input
                        id="postal"
                        v-model="form.postalcode"
                        v-validate="'required'"
                        name="postal"
                        type="text"
                        placeholder="Your Postal Code"
                      />
                      <span
                        v-show="errors.has('postal')"
                        class="help invalid-feedback"
                        >{{ errors.first('postal') }}</span
                      >
                    </b-form-group>
                  </b-col>
                  <b-col>
                    <b-form-group label="Your Community Name (*)">
                      <b-form-input
                        id="community"
                        v-model="form.community"
                        v-validate="'required'"
                        type="text"
                        name="community"
                        placeholder="Your Community/Neighbourhood"
                      />
                      <span
                        v-show="errors.has('community')"
                        class="help invalid-feedback"
                        >{{ errors.first('community') }}</span
                      >
                    </b-form-group>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col>
                    <b-form-group label="Location Check">
                      <b-form-checkbox-group v-model="form.checked" stacked>
                        <b-form-checkbox value="Outside">
                          Outside
                        </b-form-checkbox>
                        <b-form-checkbox value="Close to WiFi source">
                          Close to WiFi source
                        </b-form-checkbox>
                        <b-form-checkbox value="Sheltered">
                          Sheltered
                        </b-form-checkbox>
                        <b-form-checkbox value="Shaded">
                          Shaded (Shade is important for the temperature sensor
                          included in the device)
                        </b-form-checkbox>
                        <b-form-checkbox value="Decent airflow">
                          Decent airflow (Not windy, but not stagnant)
                        </b-form-checkbox>
                        <b-form-checkbox value="Access to electrical power ">
                          Access to electrical power (Outlet within reach of
                          cord or extension cord)
                        </b-form-checkbox>
                      </b-form-checkbox-group>
                    </b-form-group>
                  </b-col>
                </b-row>
                <hr />
                <b-form-checkbox
                  id="checkbox"
                  v-model="form.status"
                  v-validate="'required'"
                  name="checkbox"
                  value="accepted"
                  unchecked-value="not_accepted"
                >
                  I agree to the
                  <a v-b-modal.agreement-modal href="#">Terms and Conditions</a>
                </b-form-checkbox>
                <span
                  v-show="errors.has('terms')"
                  class="help invalid-feedback"
                  >{{ errors.first('terms') }}</span
                >
                <div class="text-center pt-3">
                  <b-button type="reset" variant="danger">Reset</b-button>
                  <b-button type="submit" variant="primary" class="ml-2"
                    >Submit</b-button
                  >
                </div>
              </div>
            </b-form>
          </div>
        </div>
      </div>
      <b-modal id="agreement-modal" title="Volunteer Agreement" size="lg">
        <h6 class="text-center">Volunteer Agreement - Smart Citizens</h6>
        <p>
          This Volunteer Agreement (“Agreement”), dated and effective as of
          <u> {{ now }} </u>
          is entered into by and between SensorUp Inc (“Company”) and
          <u> </u> ("Volunteer")
        </p>
        <p><strong>BACKGROUND</strong>: </p>
        <p>
          Volunteer has agreed to assemble and install a sensor provided by
          Company (the "
          <strong>Sensor</strong>") for the purpose of recording and analyzing
          air quality &nbsp;(the " <strong>Project</strong>").
        </p>
        <p
          ><strong>AGREEMENT</strong> In consideration of the agreement to pay
          $1.00 on demand, receipt and sufficiency of which is hereby
          acknowledged:
        </p>
        <ol>
          <li
            ><strong><u>Volunteer</u></strong
            >. Volunteer agrees:
          </li>
          <ol style="list-style-type: lower-latin;"
            ><li>
              to install the Sensor at
              <u>{{ form.address }}, {{ form.postalcode }}, {{ form.city }} </u>
              (“ <strong>Location</strong>”); </li
            ><li>
              that they are solely responsible for installing the Sensor and
              ensuring that the Sensor is installed in a manner which will not
              cause risk of injury or death to any person, including themselves;
              and
            </li>
            <li
              >to use the Sensor solely for the purpose of the Project at the
              Location.</li
            >
          </ol>
        </ol>
        <ol start="2">
          <li>
            <strong><u>Limitation of Liability</u></strong
            >. IN NO EVENT WILL COMPANY OR ITS LICENSOR BE LIABLE TO THE
            VOLUNTEER OR TO ANY OTHER PARTY FOR ANY INJURY, DAMAGE OR HARM THAT
            MAY ARISE FROM THE INSTALLATION OR USE OF THE SENSOR , INCLUDING
            WITHOUT LIMITATION ANY DIRECT DAMAGES OR ANY INDIRECT, SPECIAL,
            PUNITIVE, INCIDENTAL, OR CONSEQUENTIAL DAMAGES WHICH MAY ARISE OUT
            OF OR IN CONNECTION WITH THIS AGREEMENT OR THE INSTALLATION OR USE
            OF THE SENSOR.&nbsp; IN ANY EVENT, COMPANY’S TOTAL AGGREGATE
            LIABILITY ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT SHALL
            NOT EXCEED $1.00.&nbsp; THE ABOVE LIMITATIONS AND EXCLUSIONS SHALL
            APPLY TO THE MAXIMUM EXTENT PERMITTED BY LAW.
          </li>
        </ol>
        <ol start="3">
          <li
            ><strong><u>Disclaimer of Warranties</u></strong
            >. THE SENSOR IS BEING LICENSED TO VOLUNTEER “AS IS”, WITH ALL
            FAULTS.&nbsp; WITHOUT LIMITING THE GENERALITY OF THE PREVIOUS
            SENTENCE, COMPANY SPECIFICALLY DISCLAIMS ALL WARRANTIES, EXPRESS,
            STATUTORY, AND IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
            WARRANTIES OF ACCURACY, TITLE, QUIET ENJOYMENT, NON-INFRINGEMENT,
            MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
          </li>
        </ol>
        <ol start="4">
          <li
            ><strong><u>Applicable Law</u></strong
            >. This Agreement shall be governed by the laws of Alberta without
            regard to its principles of conflict of laws.&nbsp; Company and
            Volunteer hereby agree on behalf of themselves and any person
            claiming by or through them that the sole jurisdiction and venue for
            any litigation arising from or relating to this Agreement shall be
            an appropriate federal or provincial court located in Alberta.
          </li>
        </ol>
        <ol start="5">
          <li
            ><strong><u>Entire Agreement</u></strong
            >. This Agreement constitutes the entire agreement between the
            parties in connection with the subject matter hereof and supersedes
            all prior and contemporaneous agreements, understandings,
            negotiations and discussions, whether oral or written, of the
            parties, and there are no warranties, representations and/or
            agreements among the parties in connection with the subject matter
            hereof except as set forth in this Agreement.&nbsp; This Agreement,
            and the rights and obligations hereunder, may not be assigned or
            delegated by Volunteer without the prior written consent of Company.
          </li>
        </ol>
      </b-modal>
    </main-content>
  </layout>
</template>

<script>
import Layout from '@layouts/main'
import MainContent from '@layouts/main-content'

export default {
  components: { Layout, MainContent },
  data() {
    return {
      form: {
        device: '',
        city: '',
        address: '',
        postalcode: '',
        community: '',
        checked: [],
        status: 'not_accepted',
      },
      scriptURL:
        'https://script.google.com/macros/s/AKfycbxZ9ldT34jADG5MM1HYDmWMDK3nk8xkBabQNsmE-P-FHcpxhEhs/exec',
      show: true,
      now: this.$moment().format('LL'),
      isLoading: false,
      fullPage: true,
      successAlert: false,
      dangerAlert: false,
    }
  },
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.sendRegisterInfo()
        } else {
          alert('Please correct existing errors!')
        }
      })
    },
    sendRegisterInfo() {
      this.isLoading = true
      this.successAlert = false
      this.dangerAlert = false
      // send register info to the google sheet

      $.post(
        this.scriptURL,
        {
          mac: this.form.device,
          city: this.form.city,
          address: this.form.address,
          postalcode: this.form.postalcode,
          community: this.form.community,
        },
        (response) => {
          if (response.result === 'success') {
            this.successAlert = true
            this.onReset()
          } else {
            this.dangerAlert = true
          }
          this.isLoading = false
        }
      )
        // eslint-disable-next-line handle-callback-err
        .fail((error) => {
          this.successAlert = false
          this.dangerAlert = true
          this.isLoading = false
        })
    },
    onReset() {
      /* Reset our form values */
      this.form.device = ''
      this.form.city = ''
      this.form.address = ''
      this.form.postalcode = ''
      this.form.community = ''
      this.form.status = 'not_accepted'
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.$nextTick(() => {
        this.show = true
      })
    },
  },
}
</script>

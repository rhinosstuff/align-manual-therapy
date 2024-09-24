import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SUBMIT_CONTACT } from '../utils/mutations';
import { Form, Input, Button, Alert } from 'antd';
import { Card, Typography, Space } from 'antd';
import MapComponent from './Map';
import 'leaflet/dist/leaflet.css';

const { Title, Text } = Typography;

// The Contact component
export default function Contact() {
    // formData holds the name, email, and message input values
    // setFormData updates the state
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    // submitContact is the function used to trigger the mutation
    // data holds the response, loading is true when the mutation is in progress, and error holds any error that occurs
    const [submitContact, { data, loading, error }] = useMutation(SUBMIT_CONTACT);

    // Function to handle input changes (when the user types into a form field)
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        try {
            // Trigger the mutation with the form data as variables
            await submitContact({
                variables: { ...formData },
            });
            console.log('Form submitted successfully:', data);
        } catch (error) {
            console.error('Error submitting the form:', error);
        }
    };

    return (
        <div>
            <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
            <h2>How can we help?</h2>
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Name"
                    rules={[{ required: true, message: 'Please enter your name!' }]}
                >
                    <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                    />
                </Form.Item>
                <Form.Item
                    label="Email"
                    rules={[
                        { required: true, message: 'Please enter your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                    />
                </Form.Item>
                <Form.Item
                    label="Message"
                    rules={[{ required: true, message: 'Please enter your message!' }]}
                >
                    <Input.TextArea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Your Message"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                </Form.Item>
            </Form>

            {error && (
                <Alert
                    message="Error"
                    description={error.message}
                    type="error"
                    showIcon
                    style={{ marginTop: '20px' }}
                />
            )}

            {data && (
                <Alert
                    message="Success"
                    description="Form submitted successfully!"
                    type="success"
                    showIcon
                    style={{ marginTop: '20px' }}
                />
            )}
            <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
            <Title level={2}>Contact Us</Title>

            <Card bordered={true} style={{ maxWidth: 600, margin: '0 auto' }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Space direction="horizontal" size="large" style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Text strong>Phone Number</Text>
                    <Text>(801) 867-4354</Text>
                </Space>

                <Space direction="horizontal" size="large" style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Text strong>Address</Text>
                    <Text>225 North Bluff Street, Suite #23, St. George UT 84770</Text>
                </Space>

                <Space direction="horizontal" size="large" style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Text strong>Email</Text>
                    <Text>ryan@alignmtherapy.com</Text>
                </Space>
                </Space>
            </Card>
            </Space>
        </div>
        <MapComponent />
        <div style={{ marginBottom: '20px' }}></div>
    </div>
    );
}
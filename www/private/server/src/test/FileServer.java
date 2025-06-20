//
//  ========================================================================
//  Copyright (c) 1995-2016 Mort Bay Consulting Pty. Ltd.
//  ------------------------------------------------------------------------
//  All rights reserved. This program and the accompanying materials
//  are made available under the terms of the Eclipse Public License v1.0
//  and Apache License v2.0 which accompanies this distribution.
//
//      The Eclipse Public License is available at
//      http://www.eclipse.org/legal/epl-v10.html
//
//      The Apache License v2.0 is available at
//      http://www.opensource.org/licenses/apache2.0.php
//
//  You may elect to redistribute this code under either of these licenses.
//  ========================================================================
//
package test;

import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.handler.ContextHandler;
import org.eclipse.jetty.server.handler.ContextHandlerCollection;
import org.eclipse.jetty.server.handler.DefaultHandler;
import org.eclipse.jetty.server.handler.HandlerList;
import org.eclipse.jetty.server.handler.ResourceHandler;
import org.eclipse.jetty.server.NCSARequestLog;
import org.eclipse.jetty.util.resource.Resource;

import java.io.File;
import java.nio.file.FileSystem;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedHashSet;
import java.util.LinkedList;
import java.util.Set;
/**
 * Simple Jetty FileServer.
 * This is a simple example of Jetty configured as a FileServer.
 */
public class FileServer
{
    public static void main(String[] args) throws Exception
    {
        int port = 8080;
        String website  = "web-site.html";
        Set<String> resources = new LinkedHashSet<>();
         
        if (args.length < 3)
        {
           resources.add("./..");
           System.err.println("Usage: java -jar test.jar port web-site.html resource-dir");
        }
        else
        {
           try
           {
              port = Integer.parseInt(args[0]);
           }
           catch (Throwable ex)
           {
               ex.printStackTrace();
           }
            website = args[1];
            for (int i = 2; i < args.length; i++)
            {
               resources.add(args[i]);
            }
        }
        System.out.println("File server Jetty is starting... to listen HTTP port: ");
        System.out.println("port: " + port);
        System.out.println("welcome file: " + website);
        for (String resource : resources)
        {
           System.out.println("added resource directory: " + Paths.get(resource).toAbsolutePath());
        }
        // Create a basic Jetty server object that will listen on port 8080.  Note that if you set this to port 0
        // then a randomly available port will be assigned that you can either look in the logs for the port,
        // or programmatically obtain it for use in test cases.
        Server server = new Server(port);

        NCSARequestLog requestLog = new NCSARequestLog("./jetty-yyyy_mm_dd.request.log");
        requestLog.setAppend(true);
        requestLog.setExtended(true);
        requestLog.setLogTimeZone("GMT");
        requestLog.setLogLatency(true);
        requestLog.setRetainDays(90);

        server.setRequestLog(requestLog);
        
        LinkedList<Handler> handlers = new LinkedList<Handler>();
        for (String resource : resources)
        {
           ResourceHandler rh = new ResourceHandler();
           rh.setResourceBase(resource);
           Path test = Paths.get(resource + "/" + website);
           if (test.toFile().exists())
           {
              rh.setWelcomeFiles(new String[]{ website });
           }
           rh.setDirectoriesListed(true);

           ContextHandler context = new ContextHandler();
           context.setContextPath("/");
           File dir =  Paths.get(resource).toFile();
           context.setBaseResource(Resource.newResource(dir));
           context.setHandler(rh);
           handlers.add(context);
        }

        ContextHandlerCollection contexts = new ContextHandlerCollection();
        contexts.setHandlers(handlers.toArray(new Handler[handlers.size()]));

        server.setHandler(contexts);

        // Start things up! By using the server.join() the server thread will join with the current thread.
        // See "http://docs.oracle.com/javase/1.5.0/docs/api/java/lang/Thread.html#join()" for more details.
        server.start();
        server.join();
    }
}